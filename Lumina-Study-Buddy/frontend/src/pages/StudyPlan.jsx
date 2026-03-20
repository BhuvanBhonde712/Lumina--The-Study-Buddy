import { useState } from 'react';
import { CalendarDays, ChevronDown, ChevronUp, Target, Lightbulb, Clock } from 'lucide-react';
import { studyPlanAPI } from '../api';
import PageHeader from '../components/PageHeader';
import LoadingSpinner from '../components/LoadingSpinner';

const LEVELS = ['Beginner', 'Intermediate', 'Advanced'];
const DURATIONS = ['1 week', '2 weeks', '1 month', '2 months', '3 months'];
const HOURS = [1, 2, 3, 4, 5];

export default function StudyPlan() {
  const [form, setForm] = useState({ topic: '', duration: '2 weeks', level: 'Beginner', goals: '', hoursPerDay: 2 });
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [openWeek, setOpenWeek] = useState(0);
  const [openDay, setOpenDay] = useState(null);

  const generate = async () => {
    if (!form.topic.trim()) { setError('Please enter a topic.'); return; }
    setError('');
    setLoading(true);
    setPlan(null);
    try {
      const res = await studyPlanAPI.generate(form.topic, form.duration, form.level, form.goals, form.hoursPerDay);
      setPlan(res.data);
      setOpenWeek(0);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  return (
    <div className="min-h-full px-8 py-8 max-w-3xl mx-auto">
      <PageHeader icon={CalendarDays} title="Study Plan" subtitle="Get a personalized day-by-day study roadmap" accent="rose" />

      {!plan && !loading && (
        <div className="space-y-5 animate-slide-up">
          <div className="bg-surface border border-border rounded-xl p-5 space-y-4">

            <div>
              <label className="text-t2 text-xs font-medium uppercase tracking-wide block mb-2">What do you want to study?</label>
              <input
                value={form.topic}
                onChange={(e) => set('topic', e.target.value)}
                placeholder="e.g. Machine Learning, JavaScript, Organic Chemistry..."
                className="w-full bg-s2 border border-border hover:border-border-2 focus:border-rose/50 text-t1 placeholder-t3 text-sm px-4 py-3 rounded-xl outline-none transition-colors"
              />
            </div>

            <div>
              <label className="text-t2 text-xs font-medium uppercase tracking-wide block mb-2">Learning Goals (optional)</label>
              <input
                value={form.goals}
                onChange={(e) => set('goals', e.target.value)}
                placeholder="e.g. Pass an exam, build a project, get a job..."
                className="w-full bg-s2 border border-border hover:border-border-2 focus:border-rose/50 text-t1 placeholder-t3 text-sm px-4 py-3 rounded-xl outline-none transition-colors"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-t2 text-xs font-medium uppercase tracking-wide block mb-2">Duration</label>
                <div className="flex flex-col gap-1.5">
                  {DURATIONS.map((d) => (
                    <button key={d} onClick={() => set('duration', d)}
                      className={`py-1.5 px-3 rounded-lg text-xs text-left border transition-colors
                        ${form.duration === d ? 'bg-rose/10 border-rose/40 text-rose' : 'bg-s3 border-border text-t2 hover:text-t1'}`}>
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-t2 text-xs font-medium uppercase tracking-wide block mb-2">Your Level</label>
                <div className="flex flex-col gap-1.5">
                  {LEVELS.map((l) => (
                    <button key={l} onClick={() => set('level', l)}
                      className={`py-1.5 px-3 rounded-lg text-xs text-left border transition-colors
                        ${form.level === l ? 'bg-rose/10 border-rose/40 text-rose' : 'bg-s3 border-border text-t2 hover:text-t1'}`}>
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-t2 text-xs font-medium uppercase tracking-wide block mb-2">Hours / Day</label>
                <div className="flex flex-col gap-1.5">
                  {HOURS.map((h) => (
                    <button key={h} onClick={() => set('hoursPerDay', h)}
                      className={`py-1.5 px-3 rounded-lg text-xs text-left border transition-colors
                        ${form.hoursPerDay === h ? 'bg-rose/10 border-rose/40 text-rose' : 'bg-s3 border-border text-t2 hover:text-t1'}`}>
                      {h} hour{h > 1 ? 's' : ''}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {error && <p className="text-rose text-sm">{error}</p>}

          <button
            onClick={generate}
            disabled={!form.topic.trim()}
            className="w-full py-3 bg-rose/90 hover:bg-rose disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors font-display"
          >
            Generate Study Plan
          </button>
        </div>
      )}

      {loading && <LoadingSpinner message="Building your personalized study plan..." />}

      {plan && !loading && (
        <div className="animate-slide-up">
          {/* Overview */}
          <div className="bg-s2 border border-border rounded-xl p-5 mb-6">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h2 className="font-display font-700 text-t1 text-lg">{plan.title}</h2>
                <div className="flex items-center gap-3 mt-1">
                  <span className="flex items-center gap-1 text-t2 text-xs"><Clock size={11} /> {plan.totalHours}</span>
                  <span className="text-t3">·</span>
                  <span className="text-t2 text-xs">{plan.level}</span>
                  <span className="text-t3">·</span>
                  <span className="text-t2 text-xs">{plan.duration}</span>
                </div>
              </div>
              <button
                onClick={() => setPlan(null)}
                className="px-3 py-1.5 bg-s3 border border-border rounded-lg text-t2 hover:text-t1 text-xs transition-colors"
              >
                New Plan
              </button>
            </div>
            <p className="text-t2 text-sm leading-relaxed">{plan.overview}</p>
          </div>

          {/* Milestones */}
          {plan.milestones && (
            <div className="mb-6">
              <p className="text-t3 text-xs uppercase tracking-wide mb-3 flex items-center gap-1.5"><Target size={11} /> Milestones</p>
              <div className="flex flex-wrap gap-2">
                {plan.milestones.map((m) => (
                  <div key={m.id} className="flex items-center gap-2 px-3 py-2 bg-rose/5 border border-rose/20 rounded-lg">
                    <span className="w-5 h-5 rounded-full bg-rose/20 text-rose text-xs flex items-center justify-center font-medium">{m.id}</span>
                    <div>
                      <p className="text-t1 text-xs font-medium">{m.title}</p>
                      <p className="text-t2 text-xs">{m.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Weekly breakdown */}
          <div className="space-y-3 mb-6">
            <p className="text-t3 text-xs uppercase tracking-wide">Weekly Breakdown</p>
            {plan.weeks?.map((week, wi) => (
              <div key={wi} className="bg-surface border border-border rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenWeek(openWeek === wi ? -1 : wi)}
                  className="w-full flex items-center justify-between px-5 py-4 hover:bg-s2 transition-colors"
                >
                  <div className="text-left">
                    <span className="text-rose text-xs font-medium">Week {week.week}</span>
                    <p className="text-t1 text-sm font-medium mt-0.5">{week.theme}</p>
                    <p className="text-t2 text-xs">{week.objective}</p>
                  </div>
                  {openWeek === wi ? <ChevronUp size={15} className="text-t3" /> : <ChevronDown size={15} className="text-t3" />}
                </button>

                {openWeek === wi && (
                  <div className="border-t border-border">
                    {week.days?.map((day, di) => {
                      const key = `${wi}-${di}`;
                      return (
                        <div key={di} className="border-b border-border last:border-0">
                          <button
                            onClick={() => setOpenDay(openDay === key ? null : key)}
                            className="w-full flex items-center justify-between px-5 py-3 hover:bg-s3 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <span className="w-16 text-t3 text-xs text-left">{day.day}</span>
                              <span className="text-t1 text-sm">{day.focus}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-t3 text-xs">{day.duration}</span>
                              {openDay === key ? <ChevronUp size={13} className="text-t3" /> : <ChevronDown size={13} className="text-t3" />}
                            </div>
                          </button>
                          {openDay === key && (
                            <div className="px-5 pb-4 bg-s3">
                              <ul className="space-y-1.5 mb-3">
                                {day.tasks?.map((task, ti) => (
                                  <li key={ti} className="flex items-start gap-2 text-sm text-t2">
                                    <span className="w-1 h-1 rounded-full bg-rose mt-2 flex-shrink-0" />
                                    {task}
                                  </li>
                                ))}
                              </ul>
                              {day.resources?.map((r, ri) => (
                                <p key={ri} className="text-t3 text-xs flex items-center gap-1.5">
                                  <Lightbulb size={10} className="text-amber" /> {r}
                                </p>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Tips */}
          {plan.tips && (
            <div className="bg-amber/5 border border-amber/20 rounded-xl p-5">
              <p className="text-amber text-xs font-medium uppercase tracking-wide mb-3 flex items-center gap-1.5"><Lightbulb size={11} /> Study Tips</p>
              <ul className="space-y-2">
                {plan.tips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 text-t2 text-sm">
                    <span className="text-amber font-medium text-xs mt-0.5">{i + 1}.</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}