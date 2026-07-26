import { ArrowRight, Play } from 'lucide-react'
import PlayStoreButton from '../../components/common/PlayStoreButton'
import AppStoreButton from '../../components/common/AppStoreButton'
import heroImage from '../../assets/images/ajosave2.png'

const HeroSection = ({ sectionRef, onJoinBeta, onHowItWorks }) => {
  return (
    <div
      ref={sectionRef}
      className="relative pt-24 pb-32 min-h-screen flex items-center overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(rgba(17, 24, 39, 0.6), rgba(17, 24, 39, 0.6)), url(${heroImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
        backgroundRepeat: 'no-repeat',
        paddingTop: '140px',
        clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 4vw), 0 100%)',
      }}
    >
      <div className="max-w-6xl mx-auto px-4 relative z-10 w-full">
        <div className="grid lg:grid-cols-12 gap-8 items-end">
          <div className="lg:col-span-12 space-y-4 text-center lg:text-right flex flex-col items-center lg:items-end">

            {/* Eyebrow */}
            <div className="overflow-hidden px-4 lg:pl-4 lg:pr-0 w-full flex justify-center lg:justify-end">
              <span className="text-xs font-bold uppercase tracking-widest text-blue-300 animate-slideFromRight [animation-delay:0ms]">
                Community Savings, Reimagined
              </span>
            </div>

            {/* Line 1: Headline */}
            <div className="overflow-hidden px-4 lg:pl-4 lg:pr-0 w-full flex justify-center lg:justify-end">
              <h1 className="text-3xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15] max-w-4xl animate-slideFromRight [animation-delay:50ms]">
                <span>
                  Save together. <span className="text-blue-300">Trust the process.</span>
                </span>
              </h1>
            </div>

            {/* Line 2: Subtitle */}
            <div className="overflow-hidden px-4 lg:pl-4 lg:pr-0 w-full flex justify-center lg:justify-end">
              <p className="text-lg lg:text-xl text-white/90 leading-relaxed max-w-2xl animate-slideFromRight [animation-delay:100ms]">
                AjoSave brings the Ajo tradition online. Create a group, invite your people, contribute on time, and track every naira — no spreadsheets, no chasing, no confusion.
              </p>
            </div>

            {/* Line 3: Action Buttons */}
            <div className="overflow-hidden px-4 lg:pl-4 lg:pr-0 w-full flex justify-center lg:justify-end">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2 justify-center lg:justify-end w-full sm:w-auto animate-slideFromRight [animation-delay:200ms]">
                <button
                  onClick={onJoinBeta}
                  className="bg-white text-deepBlue-800 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-all flex items-center justify-center lg:justify-end gap-2 text-sm shadow-lg backdrop-blur-sm"
                >
                  Start Saving for Free <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={onHowItWorks}
                  className="flex items-center justify-center lg:justify-end gap-2 text-white hover:text-blue-300 font-medium px-5 py-3 text-sm transition-colors rounded-lg hover:bg-white/10 backdrop-blur-sm border border-white/20"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>See How It Works</span>
                </button>
              </div>
            </div>

            {/* Line 4: App Store Badges */}
            <div className="overflow-hidden px-4 lg:pl-4 lg:pr-0 w-full flex justify-center lg:justify-end">
              <div className="pt-4 flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-end animate-slideFromRight [animation-delay:300ms]">
                <div className="flex gap-3 opacity-90">
                  <PlayStoreButton size="sm" />
                  <AppStoreButton size="sm" />
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default HeroSection
