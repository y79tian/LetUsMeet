import React from "react";
import { Link } from "react-router-dom";
import {
  Icon,
  Item,
  List,
  Segment,
  SegmentGroup,
  Button,
} from "semantic-ui-react";
import EventListAttendee from "./EventListAttendee";

export default function EventListItem({ event, selectEvent, deleteEvent }) {
  return (
    <SegmentGroup>
      <Segment>
        <Item.Group>
          <Item>
            <Item.Image size="tiny" circular src={event.hostPhotoURL} />
            <Item.Content>
              <Item.Header content={event.title} />
              <Item.Description>Hosted By {event.hostedBy}</Item.Description>
            </Item.Content>
          </Item>
        </Item.Group>
      </Segment>
      <Segment>
        <span>
          <Icon name="clock" /> {event.date}
          <Icon name="marker" /> {event.venue}
        </span>
      </Segment>
      <Segment secondary>
        <List horizontal>
          {event.attendees.map((attendee) => (
            <EventListAttendee key={attendee.id} attendee={attendee} />
          ))}
        </List>
      </Segment>
      <Segment clearing>
        <div>{event.description}</div>
        <Button
          color="red"
          floated="right"
          content="Delete"
          onClick={() => deleteEvent(event.id)}
        />
        <Button
          color="teal"
          floated="right"
          content="View"
          as={Link}
          to={`/events/${event.id}`}
        />
      </Segment>
    </SegmentGroup>
  );
}
