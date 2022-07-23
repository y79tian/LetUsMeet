/* global google*/
import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import { useSelector, useDispatch } from "react-redux";
import { Segment, Header, Button, Confirm } from "semantic-ui-react";
import { Link, Redirect } from "react-router-dom";
import { listenToSelectedEvent, clearSelectedEvent } from "../eventAction";
import * as Yup from "yup";
import MyTextInput from "../../../app/common/form/MyTextInput";
import MyTextArea from "../../../app/common/form/MyTextArea";
import MySelectInput from "../../../app/common/form/MySelectInput";
import MyDateInput from "../../../app/common/form/MyDateInput";
import { categoryData } from "../../../app/api/categoryOptions";
import MyPlaceInput from "../../../app/common/form/MyPlaceInput";
import useFirestoreDoc from "../../../app/hooks/useFirestoreDoc";
import {
  addEventToFirestore,
  cancelEventToggle,
  listenToEventFromFirestore,
  updateEventInFirestore,
} from "../../../app/firestore/firestoreService";
import LoadingComponent from "../../../app/layout/Loading";
import { toast } from "react-toastify";

export default function EventForm({ match, history, location }) {
  const dispatch = useDispatch();
  const [loadingCancel, setLoadingCancel] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const { loading, error } = useSelector((state) => state.async);
  const { selectedEvent } = useSelector((state) => state.event);
  useEffect(() => {
    if (location.pathname !== "/createEvent") return;

    dispatch(clearSelectedEvent());
  }, [dispatch, location.pathname]);

  const initialValues = selectedEvent ?? {
    title: "",
    category: "",
    description: "",
    city: {
      address: "",
      latLng: null,
    },
    venue: {
      address: "",
      latLng: null,
    },
    date: "",
  };

  const validationSchema = Yup.object({
    title: Yup.string().required("You must provide a title"),
    category: Yup.string().required("You must provide a category"),
    description: Yup.string().required("You must provide a title"),
    city: Yup.object().shape({
      address: Yup.string().required("City is required"),
    }),
    venue: Yup.object().shape({
      address: Yup.string().required("Venue is required"),
    }),
    date: Yup.string().required("You must provide a title"),
  });

  async function handleCancelToggle(event) {
    setConfirmOpen(false);
    setLoadingCancel(true);
    try {
      await cancelEventToggle(event);
      setLoadingCancel(false);
    } catch (error) {
      setLoadingCancel(false);
      toast.error(error.message);
    }
  }
  useFirestoreDoc({
    shouldExecute:
      match.params.id !== selectedEvent?.id &&
      location.pathname !== "/createEvent",
    query: () => listenToEventFromFirestore(match.params.id),
    data: (event) => dispatch(listenToSelectedEvent(event)),
    deps: [match.params.id, dispatch],
  });

  if (loading) return <LoadingComponent content="Loading event..." />;

  if (error) return <Redirect to="/error" />;
  return (
    <Segment clearing>
      <Formik
        enableReinitialize
        validationSchema={validationSchema}
        initialValues={initialValues}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            // {...A, ...B} take the content from A first, then use content from B to cover/update
            selectedEvent
              ? await updateEventInFirestore(values)
              : await addEventToFirestore(values);
            setSubmitting(false);
            history.push("/events");
          } catch (error) {
            toast.error(error.message);
            setSubmitting(false);
          }
        }}
      >
        {/* we don't need handleChange, handleSubmit and values here since we are using component Form and FormField from Formik */}
        {({ isSubmitting, dirty, isValid, values }) => (
          <Form className="ui form">
            <Header sub color="teal" content="Event Details" />
            <MyTextInput name="title" placeholder="Event title" />
            <MySelectInput
              name="category"
              placeholder="Event category"
              options={categoryData}
            />
            <MyTextArea name="description" placeholder="Description" rows={3} />
            <Header sub color="teal" content="Event Location Details" />
            <MyPlaceInput name="city" placeholder="City" />
            <MyPlaceInput
              name="venue"
              disabled={!values.city.latLng}
              placeholder="Venue"
              options={{
                location: new google.maps.LatLng(values.city.latLng),
                radius: 1000,
                types: ["establishment"],
              }}
            />
            <MyDateInput
              name="date"
              placeholder="Event date"
              timeFormat="HH:mm"
              showTimeSelect
              timeCaption="time"
              dateFormat="MMMM d, yyyy h:mm a"
              autoComplete='off'
            />
            {selectedEvent && (
              <Button
                loading={loadingCancel}
                type="button"
                floated="left"
                color={selectedEvent.isCancelled ? "green" : "red"}
                content={
                  selectedEvent.isCancelled
                    ? "Reactivate Event"
                    : "Cancel Event"
                }
                onClick={() => setConfirmOpen(true)}
              />
            )}
            <Button
              loading={isSubmitting}
              disabled={!isValid || isSubmitting || !dirty}
              type="submit"
              floated="right"
              positive
              content="Submit"
            />
            <Button
              disabled={isSubmitting}
              as={Link}
              to="/events"
              type="submit"
              floated="right"
              content="Cancel"
            />
          </Form>
        )}
      </Formik>
      <Confirm
        content={
          selectedEvent?.isCancelled
            ? "This will reactivate the event - are you sure?"
            : "This will cancel the event - are you sure?"
        }
        open={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => handleCancelToggle(selectedEvent)}
      />
    </Segment>
  );
}
