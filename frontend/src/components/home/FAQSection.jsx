import { useState } from 'react'
import { ChevronDown, ExternalLink, MessageCircle } from 'lucide-react'

const FAQ_DATA = [
  {
    id: 1,
    question: "What exactly is AjoSave?",
    answer: "AjoSave is a digital platform for community savings — the kind your family, friends, or colleagues have always done informally. We take the traditional Ajo (also called Esusu or thrift) and put it online so contributions are tracked, rotations are automated, and every member can see exactly what is happening at any time."
  },
  {
    id: 2,
    question: "How is this different from a regular bank savings account?",
    answer: "AjoSave is not a bank. It is a coordination tool for group savings. The difference is accountability and community — your group contributes together, and each member receives the full pool when it is their turn. It combines the discipline of structured saving with the motivation of a shared goal."
  },
  {
    id: 3,
    question: "Is my money safe on AjoSave?",
    answer: "We take this seriously. AjoSave uses secure authentication, encrypted communication, and maintains a fully transparent transaction record for every group. We do not hold your funds — payments move directly between verified members. Every transaction is logged and visible to the group."
  },
  {
    id: 4,
    question: "What happens if a member misses a contribution?",
    answer: "The app sends automatic reminders before each contribution is due. If someone misses a payment, it is immediately visible to the whole group. Group admins can set their own rules around defaults, and our support team is available to help resolve disputes."
  },
  {
    id: 5,
    question: "Who can use AjoSave?",
    answer: "Anyone who wants to save with others. Families, friends, coworkers, cooperative societies, clubs, religious groups, and small businesses all use rotating savings. AjoSave works for all of them. You can also use it as an individual with a personal savings goal."
  },
  {
    id: 6,
    question: "Can I create my own group and set my own rules?",
    answer: "Yes. When you create a group, you choose the contribution amount, how often members contribute, how the rotation order is determined, and the group size. Members see all the rules before they join, so everyone starts on the same page."
  },
  {
    id: 7,
    question: "What devices does AjoSave work on?",
    answer: "AjoSave works on Android and iOS smartphones, tablets, and any modern web browser. Everything syncs across your devices so you are never out of the loop, whether you check from your phone or your laptop."
  },
  {
    id: 8,
    question: "Is AjoSave free to use?",
    answer: "AjoSave is currently in beta and free to access. We are focused on building something that genuinely works well before we introduce any pricing. Beta users get early access and help shape how the platform develops."
  }
]

const FAQSection = ({ onContact }) => {
  const [openFAQ, setOpenFAQ] = useState(null)

  return (
    <div className="bg-gradient-to-br from-deepBlue-50/40 to-blue-50/60 py-20 border-b border-deepBlue-100/60">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-blue-500 mt-8 mb-4 overflow-hidden">
            <span className="block animate-slideUpReveal-scroll faq-header">Common questions</span>
          </h2>
          <p className="text-deepBlue-600 mb-6 max-w-2xl mx-auto leading-relaxed">
            If something is not covered here, reach out — we read every message.
          </p>
          {/* Reddit Community Link */}
          <a
            href="https://www.reddit.com/r/ajosave/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-white border border-deepBlue-200 rounded-xl px-4 py-3 hover:border-deepBlue-300 transition-all group cursor-pointer shadow-sm"
          >
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
              <MessageCircle className="w-4 h-4 text-white" />
            </div>
            <div className="text-left">
              <div className="text-sm font-semibold text-deepBlue-800 group-hover:text-deepBlue-900">
                Join r/AjoSave Community
              </div>
              <div className="text-xs text-deepBlue-600">
                Get help from other users and our team
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-deepBlue-400 group-hover:text-deepBlue-600" />
          </a>
          </div>


          <div className="space-y-4">
            {FAQ_DATA.map((faq) => (
              <div
                key={faq.id}
                className="bg-white border border-deepBlue-100 rounded-xl overflow-hidden hover:border-deepBlue-200 transition-all shadow-sm"
              >
                <button
                  onClick={() => setOpenFAQ(openFAQ === faq.id ? null : faq.id)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-deepBlue-50/30 transition-colors"
                >
                  <span className="font-semibold text-deepBlue-800 pr-4">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-deepBlue-500 transition-transform flex-shrink-0 ${openFAQ === faq.id ? 'rotate-180' : ''
                      }`}
                  />
                </button>
                {openFAQ === faq.id && (
                  <div className="px-6 pb-5 animate-fadeIn">
                    <div className="pt-2 border-t border-deepBlue-100/50">
                      <p className="text-deepBlue-600 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="text-center mt-8 pt-6 border-t border-deepBlue-200/50">
            <p className="text-sm text-deepBlue-600 mb-3">
              Still have questions? We are happy to help.
            </p>
            <button
              onClick={onContact}
              className="text-deepBlue-700 hover:text-deepBlue-800 font-medium text-sm underline underline-offset-2 hover:underline-offset-4 transition-all"
            >
              Talk to us
            </button>
          </div>
        </div>
      </div>
      )
}

      export default FAQSection
