import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, Clock, Plus } from 'lucide-react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { useState } from 'react';

const upcomingEvents = [
  { id: '1', title: 'Team Standup', time: '9:00 AM', date: 'Today' },
  { id: '2', title: 'Product Review', time: '2:00 PM', date: 'Today' },
  { id: '3', title: 'Design Workshop', time: '10:00 AM', date: 'Tomorrow' },
];

export default function CalendarPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar />
      <main className="flex-1 p-6 md:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-5xl mx-auto"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Calendar</h1>
              <p className="text-muted-foreground">Manage your schedule</p>
            </div>
            <Button variant="glow">
              <Plus className="w-4 h-4" />
              New Event
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Calendar */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="glass rounded-2xl p-6"
            >
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md"
              />
            </motion.div>

            {/* Upcoming events */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="glass rounded-2xl p-6"
            >
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-primary" />
                Upcoming Events
              </h2>
              <div className="space-y-4">
                {upcomingEvents.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="flex items-center gap-4 p-3 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors"
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{event.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {event.date} • {event.time}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
