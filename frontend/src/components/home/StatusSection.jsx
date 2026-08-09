import { memo } from 'react'
import { Monitor, CheckCircle } from 'lucide-react'

// Spinner kept local since it's only used here
const SpinnerIcon = memo(() => (
  <div className="w-4 h-4 border-2 border-deepBlue-600 border-t-transparent rounded-full animate-spin"></div>
))
SpinnerIcon.displayName = 'SpinnerIcon'

const SYSTEM_STATUS_CARDS = [
  {
    icon: Monitor,
    title: "Live and working",
    bgColor: "bg-deepBlue-100",
    iconColor: "text-deepBlue-600",
    features: [
      "Real-time balance updates",
      "Automatic rotation scheduling",
      "Syncs across all your devices"
    ],
    statusColor: "emerald-400"
  },
  {
    icon: SpinnerIcon,
    title: "Actively improving",
    bgColor: "bg-deepBlue-100",
    iconColor: "text-deepBlue-600",
    features: [
      "Faster payment processing",
      "Smarter contribution reminders",
      "Smoother mobile experience"
    ],
    statusColor: "deepBlue-400"
  },
  {
    icon: CheckCircle,
    title: "Your contributions are protected",
    bgColor: "bg-yellow-100",
    iconColor: "text-yellow-700",
    description: "Every transaction is recorded and visible to all group members. No hidden movements, no missing funds — just a clear, verifiable history your group can trust."
  }
]

const StatusSection = ({ sectionRef }) => {
  return (
    <div
      ref={sectionRef}
      className="relative bg-deepBlue-700 pt-32 pb-36 overflow-hidden -mt-[4vw]"
      style={{
        clipPath: 'polygon(0 4vw, 100% 0, 100% calc(100% - 4vw), 0 100%)',
      }}
    >
      <div className="relative z-10 max-w-6xl mx-auto px-4">
        <div className="max-w-2xl mb-14">
          <h2 className="text-xs font-bold uppercase tracking-widest text-deepBlue-200 mb-2">Why digital is better</h2>
          <p className="text-4xl font-bold tracking-tight text-white">
            Managing contributions manually leaves too much room for error.
          </p>
          <p className="text-deepBlue-100 mt-4 text-base leading-relaxed max-w-xl">
            Forgotten payments, lost records, and awkward conversations about money damage trust. AjoSave handles the coordination so your group can focus on saving.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {SYSTEM_STATUS_CARDS.map((card, index) => (
            <div key={index} className="p-6 border border-white/20 bg-white/10 backdrop-blur-sm rounded-xl space-y-4">
              <div className={`w-8 h-8 ${card.bgColor} ${card.iconColor} rounded-lg flex items-center justify-center`}>
                <card.icon className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-white text-base">{card.title}</h3>
              {card.features ? (
                <ul className="space-y-2.5 text-sm text-deepBlue-100">
                  {card.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-2">
                      <span className={`w-1.5 h-1.5 rounded-full bg-${card.statusColor}`}></span> {feature}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-deepBlue-100 leading-relaxed">{card.description}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default StatusSection
