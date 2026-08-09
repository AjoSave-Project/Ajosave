import { CheckCircle } from 'lucide-react'

const CTASection = ({ onJoinBeta, onPrivacyPolicy }) => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-20">
      <div className="border border-deepBlue-600 bg-deepBlue-700 text-white rounded-2xl p-8 lg:p-12 relative overflow-hidden grid md:grid-cols-12 gap-8 items-center">
        <div className="md:col-span-8 space-y-4 z-10">
          <h3 className="text-2xl font-bold tracking-tight">
            Ready to save together?
          </h3>
          <p className="text-deepBlue-200 text-sm max-w-xl leading-relaxed">
            Start a group with your friends, family, or colleagues. Set your contribution schedule, invite your members, and let AjoSave handle the rest. It is free while we are in beta.
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-2 pt-2 text-xs text-deepBlue-100 font-mono">
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-deepBlue-300" /> Free during beta
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-deepBlue-300" /> No credit card needed
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-deepBlue-300" /> Help shape the product
            </span>
          </div>
        </div>
        <div className="md:col-span-4 flex flex-col sm:flex-row md:flex-col gap-3 md:items-end z-10">
          <button
            onClick={onJoinBeta}
            className="bg-white text-deepBlue-800 px-6 py-3.5 rounded-lg font-semibold hover:bg-deepBlue-50 transition-colors text-sm shadow-sm whitespace-nowrap text-center w-full md:w-auto"
          >
            Start Saving for Free
          </button>
        </div>
      </div>
    </div>
  )
}

export default CTASection
