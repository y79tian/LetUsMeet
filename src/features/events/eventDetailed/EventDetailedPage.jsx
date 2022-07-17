import React from "react";
import { useSelector } from "react-redux";
import { Grid } from "semantic-ui-react";
import { listenToEventFromFirestore } from "../../../app/firestore/firestoreService";
import useFirestoreDoc from "../../../app/hooks/useFirestoreDoc";
import { listenToEvents } from "../eventAction";
import EventDetailedChat from "./EventDetailedChat";
import EventDetailedHeader from "./EventDetailedHeader";
import EventDetailedInfo from "./EventDetailedInfo";
import EventDetailedSidebar from "./EventDetailedSidebar";
import LoadingComponent from "../../../app/layout/Loading";
import { useDispatch } from "react-redux";
import { Redirect } from "react-router-dom";

export default function EventDetailedPage({ match }) {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.auth);
  const event = useSelector((state) =>
    state.event.events.find((evt) => evt.id === match.params.id)
  );
  const { loading, error } = useSelector((state) => state.async);
  // if event undefined, the right hand side is undefined, undefined is false
  const isHost = event?.hostUid === currentUser.uid;
  const isGoing = event?.attendees?.some((a) => a.id === currentUser.uid);
  useFirestoreDoc({
    query: () => listenToEventFromFirestore(match.params.id),
    data: (event) => dispatch(listenToEvents([event])),
    deps: [match.params.id, dispatch],
  });

  if (loading || (!event && !error))
    return <LoadingComponent content="Loading event..." />;

  if (error) return <Redirect to="/error" />;
  return (
    <Grid>
      <Grid.Column width={10}>
        <EventDetailedHeader event={event} isGoing={isGoing} isHost={isHost} />
        <EventDetailedInfo event={event} />
        <EventDetailedChat />
      </Grid.Column>
      <Grid.Column width={6}>
        <EventDetailedSidebar
          attendees={event.attendees}
          hostUid={event.hostUid}
        />
      </Grid.Column>
    </Grid>
  );
}
