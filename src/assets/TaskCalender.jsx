import { useEffect, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";

export default function TaskCalendar({
  tasks,
  selectedDate,
  setSelectedDate,
}) {
  const calendarRef = useRef(null);

  const formatDate = (targetDate) => {
    const year = targetDate.getFullYear();
    const month = String(targetDate.getMonth() + 1).padStart(2, "0");
    const day = String(targetDate.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    const calendarApi = calendarRef.current?.getApi();

    if (!calendarApi || !selectedDate) {
      return;
    }

    calendarApi.gotoDate(selectedDate);
  }, [selectedDate]);

  const calendarEvents = tasks.map((task) => {
    if (task.scheduled_start || task.scheduled_end) {
      return {
        id: String(task.id),
        title: task.task,
        date: task.deadline,
        start: task.scheduled_start ? `${task.deadline}T${task.scheduled_start}:00` : "",
        end: task.scheduled_end ? `${task.deadline}T${task.scheduled_end}:00` : "",
      };
    }

    return {
      id: String(task.id),
      title: task.task,
      date: task.deadline,
    };
  });

  return (
    <section id='task-calendar'>
      <h2>カレンダー</h2>
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
        initialView='timeGridDay'
        initialDate={selectedDate}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        slotMinTime='08:30:00'
        slotMaxTime='22:00:00'
        scrollTime='08:30:00'
        slotDuration='00:30:00'
        allDaySlot={false}
        nowIndicator={true}
        dateClick={(info) => {
          const clickedDate = formatDate(info.date);
          const calendarApi = calendarRef.current?.getApi();
          setSelectedDate(clickedDate);
          calendarApi?.changeView("timeGridDay", clickedDate);
        }}
        events={calendarEvents}
        height='100%'
      />
    </section>
  );
}
