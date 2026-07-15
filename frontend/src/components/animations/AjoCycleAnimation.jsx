import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { gsap } from "gsap";

import AdunniImg from "../../assets/images/Adunni.jpg";
import BolajiImg from "../../assets/images/Bolaji.jpg";
import ChiomaImg from "../../assets/images/Chioma.jpg";
import DayoImg from "../../assets/images/Dayo.jpg";
import EmekaImg from "../../assets/images/Emeka.jpg";
import FatimaImg from "../../assets/images/Fatima.jpg";

const MEMBERS = [
  {
    id: 1,
    name: "Adunni",
    avatar: AdunniImg,
    contribution: 50000,
    color: "#2563eb",
  },
  {
    id: 2,
    name: "Bolaji",
    avatar: BolajiImg,
    contribution: 50000,
    color: "#16a34a",
  },
  {
    id: 3,
    name: "Chioma",
    avatar: ChiomaImg,
    contribution: 50000,
    color: "#9333ea",
  },
  {
    id: 4,
    name: "Dayo",
    avatar: DayoImg,
    contribution: 50000,
    color: "#f59e0b",
  },
  {
    id: 5,
    name: "Emeka",
    avatar: EmekaImg,
    contribution: 50000,
    color: "#dc2626",
  },
  {
    id: 6,
    name: "Fatima",
    avatar: FatimaImg,
    contribution: 50000,
    color: "#4f46e5",
  },
];

const CARDS = MEMBERS.map((member) => ({
  id: member.id,
  memberId: member.id,
  amount: member.contribution,
}));

const SIZE_WIDTH = 820;
const SIZE_HEIGHT = 520;
const RADIUS = 215;

export default function AjoCycleAnimation() {
  const containerRef = useRef(null);
  const memberRefs = useRef([]);
  const cardRefs = useRef([]);
  const stackRef = useRef(null);
  const poolAmountRef = useRef(null);
  const timeline = useRef(null);

  const [receiver, setReceiver] = useState(0);
  const [currentMonthIndex, setCurrentMonthIndex] = useState(0);
  
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const positions = useMemo(() => {
    return MEMBERS.map((_, index) => {
      const angle = (Math.PI * 2 * index) / MEMBERS.length - Math.PI / 2;
      return {
        x: Math.cos(angle) * RADIUS,
        y: Math.sin(angle) * RADIUS,
      };
    });
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.set(memberRefs.current, { scale: 1, opacity: 1 });
      gsap.set(cardRefs.current, { opacity: 0, scale: 0 });
      gsap.set(stackRef.current, { scale: 1 });

      gsap.to(cardRefs.current, {
        opacity: 1,
        scale: 1,
        duration: 0.5,
        delay: 0.3,
        stagger: 0.06,
      });

      if (timeline.current) timeline.current.kill();

      timeline.current = gsap.timeline({ repeat: -1, repeatDelay: 1, paused: true });

      MEMBERS.forEach((member, index) => {
        timeline.current
          .to(
            cardRefs.current[index],
            {
              x: -positions[index].x - 5,
              y: -positions[index].y - 165,
              rotation: gsap.utils.random(-18, 18),
              duration: 0.75,
              ease: "power2.inOut",
            },
            "+=0.15"
          )
          .to(poolAmountRef.current, {
            duration: 0.4,
            onUpdate() {
              const value = Math.round(
                (gsap.getProperty(this, "progress")) *
                  member.contribution *
                  (index + 1)
              );
              if (poolAmountRef.current) {
                poolAmountRef.current.innerHTML = "₦" + value.toLocaleString();
              }
            },
          }, "<")
          .to(cardRefs.current[index], { scale: 0.9, rotation: gsap.utils.random(-10, 10), duration: 0.25 }, "<")
          .to(stackRef.current, { scale: 1.05, duration: 0.2, ease: "power2.out" }, "<");
      });

      timeline.current
        .to(stackRef.current, { scale: 1.08, duration: 0.2 })
        .to(stackRef.current, { scale: 1, duration: 0.2 })
        .to(cardRefs.current, {
          x: (i) => positions[receiver].x - positions[i].x,
          y: (i) => positions[receiver].y - positions[i].y - 100,
          scale: 1,
          zIndex: 50,
          duration: 0.9,
          ease: "power2.inOut",
        }, "+=0.4")
        .to(memberRefs.current[receiver], {
          scale: 1.18,
          duration: 0.35,
          repeat: 1,
          yoyo: true,
        }, "<")
        .call(() => setReceiver((prev) => (prev + 1) % MEMBERS.length))
        .to(cardRefs.current, {
          x: 0,
          y: 0,
          rotation: 0,
          scale: 1,
          duration: 0.6,
          ease: "power2.inOut",
          stagger: 0.05,
        }, "+=0.5")
        .to(poolAmountRef.current, {
          duration: 0.3,
          onUpdate() {
            const progress = 1 - (gsap.getProperty(this, "progress"));
            const value = Math.round(progress * MEMBERS.length * 50000);
            if (poolAmountRef.current) {
              poolAmountRef.current.innerHTML = "₦" + value.toLocaleString();
            }
          },
        }, "<")
        .call(() => {
          setCurrentMonthIndex((prev) => (prev + 1) % 12);
        })
        .to({}, { duration: 0.3 });

      timeline.current.play();
    }, containerRef);

    return () => {
      ctx.revert();
      if (timeline.current) timeline.current.kill();
    };
  }, [receiver, positions, currentMonthIndex]);

  return (
    <section className="w-full flex flex-col items-center py-14">
      <div className="mb-6">
        <div className="bg-gradient-to-r from-deepBlue-600 to-deepBlue-700 text-deepBlue-200 px-6 py-3 rounded-full shadow-lg">
          <span className="text-sm font-semibold uppercase tracking-wider">
            {months[currentMonthIndex]}
          </span>
        </div>
      </div>
      
      <div
        ref={containerRef}
        className="relative"
        style={{ width: SIZE_WIDTH, height: SIZE_HEIGHT }}
      >
        {/* Central Pool */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-30">
          <div
            ref={stackRef}
            className="relative w-32 h-14 rounded-xl bg-gradient-to-br from-deepBlue-600 to-deepBlue-800 shadow-2xl flex flex-col justify-center items-center text-white"
          >
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-20 h-2 rounded-full bg-white/10" />
            <p className="text-[10px] uppercase tracking-widest opacity-70 mb-1">Pool</p>
            <h2 ref={poolAmountRef} className="text-lg font-medium">₦0</h2>
          </div>
        </div>

        {/* Members */}
        {MEMBERS.map((member, index) => {
          const position = positions[index];
          return (
            <div
              key={member.id}
              className="absolute"
              style={{
                left: `calc(50% + ${position.x}px)`,
                top: `calc(50% + ${position.y}px)`,
                transform: "translate(-50%, -50%)",
              }}
            >
              <div
                ref={(el) => { memberRefs.current[index] = el; }}
                className="flex flex-col items-center gap-3"
              >
                <div className="relative">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-2xl"
                  />
                  <span
                    className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-white"
                    style={{ background: member.color }}
                  />
                </div>
                <div className="text-center">
                  <h3 className="text-base font-semibold text-deepBlue-800">
                    {member.name}
                  </h3>
                </div>
              </div>
            </div>
          );
        })}

        {/* Contribution Cards - Directly ON the profiles (overlapping below avatar) */}
        {CARDS.map((card, index) => {
          const position = positions[index];
          return (
            <div
              key={card.id}
              ref={(el) => { cardRefs.current[index] = el; }}
              className="absolute z-40"
              style={{
                left: `calc(50% + ${position.x}px + 8px)`,   // Almost centered under avatar
                top: `calc(50% + ${position.y}px + 52px)`,   // Tightly below avatar, partially overlapping name area
              }}
            >
              <div className="w-[78px] rounded-lg bg-white border border-deepBlue-100 shadow-xl overflow-hidden">
                <div className="bg-deepBlue-600 text-white text-center text-[8px] py-0.5 font-semibold tracking-wider">
                  AJOSAVE
                </div>
                <div className="p-2 text-center">
                  <p className="text-xs font-bold text-deepBlue-700">₦50K</p>
                  <div className="mt-1 flex items-center justify-center gap-1">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ background: MEMBERS[index].color }}
                    />
                    <span className="text-[8px] font-medium text-gray-600">
                      {MEMBERS[index].name}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Decorative Background */}
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <div className="absolute left-1/2 top-1/2 w-[560px] h-[440px] rounded-full border border-deepBlue-100 -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute left-1/2 top-1/2 w-[420px] h-[330px] rounded-full border border-dashed border-deepBlue-200 -translate-x-1/2 -translate-y-1/2" />
        </div>
      </div>
    </section>
  );
}