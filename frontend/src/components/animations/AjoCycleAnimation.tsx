import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { gsap } from "gsap";

interface Member {
  id: number;
  name: string;
  avatar: string;
  contribution: number;
  color: string;
}

interface Card {
  id: number;
  memberId: number;
  amount: number;
}

const MEMBERS: Member[] = [
  {
    id: 1,
    name: "Adunni",
    avatar: "/src/assets/images/Adunni.jpg",
    contribution: 50000,
    color: "#2563eb",
  },
  {
    id: 2,
    name: "Bolaji",
    avatar: "/src/assets/images/Bolaji.jpg",
    contribution: 50000,
    color: "#16a34a",
  },
  {
    id: 3,
    name: "Chioma",
    avatar: "/src/assets/images/Chioma.jpg",
    contribution: 50000,
    color: "#9333ea",
  },
  {
    id: 4,
    name: "Dayo",
    avatar: "/src/assets/images/Dayo.jpg",
    contribution: 50000,
    color: "#f59e0b",
  },
  {
    id: 5,
    name: "Emeka",
    avatar: "/src/assets/images/Emeka.jpg",
    contribution: 50000,
    color: "#dc2626",
  },
  {
    id: 6,
    name: "Fatima",
    avatar: "/src/assets/images/Fatima.jpg",
    contribution: 50000,
    color: "#4f46e5",
  },
];

const CARDS: Card[] = MEMBERS.map((member) => ({
  id: member.id,
  memberId: member.id,
  amount: member.contribution,
}));

const SIZE_WIDTH = 700;
const SIZE_HEIGHT = 450;
const RADIUS = 160;

export default function AjoCycleAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const memberRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const stackRef = useRef<HTMLDivElement>(null);
  const poolAmountRef = useRef<HTMLHeadingElement>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);

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
    console.log('Animation component mounted, starting month:', months[currentMonthIndex]);
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // Set members to be visible from the start - no resetting
      gsap.set(memberRefs.current, {
        scale: 1,
        opacity: 1,
      });

      // Only cards start hidden and animate in
      gsap.set(cardRefs.current, {
        opacity: 0,
        scale: 0,
      });

      // Pool starts visible
      gsap.set(stackRef.current, {
        scale: 1,
      });

      // Animate cards in initially
      gsap.to(cardRefs.current, {
        opacity: 1,
        scale: 1,
        duration: 0.5,
        delay: 0.3,
        stagger: 0.06,
      });

      // Kill existing timeline if it exists
      if (timeline.current) {
        timeline.current.kill();
      }

      timeline.current = gsap.timeline({
        repeat: -1,
        repeatDelay: 1,
        paused: true,
      });

      MEMBERS.forEach((member, index) => {
        timeline.current!
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
          .to(
            poolAmountRef.current,
            {
              duration: 0.4,
              onUpdate() {
                const value = Math.round(
                  (gsap.getProperty(this, "progress") as number) *
                    member.contribution *
                    (index + 1)
                );

                if (poolAmountRef.current) {
                  poolAmountRef.current.innerHTML = "₦" + value.toLocaleString();
                }
              },
            },
            "<"
          )
          .to(
            cardRefs.current[index],
            {
              scale: 0.9,
              rotation: gsap.utils.random(-10, 10),
              duration: 0.25,
            },
            "<"
          )
          .to(
            stackRef.current,
            {
              scale: 1.05,
              duration: 0.2,
              ease: "power2.out"
            },
            "<"
          );
      });

      timeline.current
        .to(stackRef.current, {
          scale: 1.08,
          duration: 0.2,
        })
        .to(stackRef.current, {
          scale: 1,
          duration: 0.2,
        })
        .to(
          cardRefs.current,
          {
            x: (i) => positions[receiver].x - positions[i].x,
            y: (i) => positions[receiver].y - positions[i].y - 100,
            scale: 1,
            zIndex: 50,
            duration: 0.9,
            ease: "power2.inOut",
          },
          "+=0.4"
        )
        .to(
          memberRefs.current[receiver],
          {
            scale: 1.18,
            duration: 0.35,
            repeat: 1,
            yoyo: true,
          },
          "<"
        )
        .call(() => {
          setReceiver((prev) => {
            return (prev + 1) % MEMBERS.length;
          });
        })
        // Only reset the cards, not other elements
        .to(cardRefs.current, {
          x: 0,
          y: 0,
          rotation: 0,
          scale: 1,
          duration: 0.6,
          ease: "power2.inOut",
          stagger: 0.05,
        }, "+=0.5")
        // Reset pool amount gradually
        .to(
          poolAmountRef.current,
          {
            duration: 0.3,
            onUpdate() {
              const progress = 1 - (gsap.getProperty(this, "progress") as number);
              const value = Math.round(progress * MEMBERS.length * 50000);

              if (poolAmountRef.current) {
                poolAmountRef.current.innerHTML = "₦" + value.toLocaleString();
              }
            },
          },
          "<"
        )
        .call(() => {
          // Increment month counter when cards have finished resetting
          console.log('Counter updating from', months[currentMonthIndex], 'to next month');
          setCurrentMonthIndex((prevIndex) => {
            const newIndex = (prevIndex + 1) % 12;
            console.log('Month updated from index', prevIndex, 'to', newIndex, '(' + months[newIndex] + ')');
            return newIndex;
          });
        })
        .to({}, {
          duration: 0.3
        });

      timeline.current.play();
    }, containerRef);

    return () => {
      ctx.revert();
      if (timeline.current) {
        timeline.current.kill();
      }
    };
  }, [receiver, positions, currentMonthIndex]); // Added currentMonthIndex to dependencies

  return (
    <section className="w-full flex flex-col items-center py-14">
      {/* Month Counter */} 
      <div className="mb-6">
        <div className="bg-gradient-to-r from-deepBlue-600 to-deepBlue-700 text-deepBlue-200 px-6 py-3 rounded-full shadow-lg">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold uppercase tracking-wider">
              {months[currentMonthIndex]}
            </span>
          </div>
        </div>
      </div>
      
      <div
        ref={containerRef}
        className="relative"
        style={{
          width: SIZE_WIDTH,
          height: SIZE_HEIGHT,
        }}
      >
        {/* Central Pool */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-30">
          <div
            ref={stackRef}
            className="relative w-30 h-12 rounded-xl bg-gradient-to-br from-deepBlue-600 to-deepBlue-800 shadow-2xl flex flex-col justify-center items-center text-white"
          >
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-20 h-2 rounded-full bg-white/10" />

            <p className="text-[10px] uppercase tracking-widest opacity-70 mb-1">
              Pool
            </p>
            <h2 ref={poolAmountRef} className="text-md mx-6 font-medium">
              ₦0
            </h2>
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
                ref={(el) => {
                  memberRefs.current[index] = el;
                }}
                className="flex flex-col items-center gap-3"
              >
                <div className="relative">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-xl"
                  />
                  <span
                    className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white"
                    style={{
                      background: member.color,
                    }}
                  />
                </div>
                <div className="text-center">
                  <h3 className="text-sm font-semibold text-deepBlue-800">
                    {member.name}
                  </h3>
                </div>
              </div>
            </div>
          );
        })}

        {/* Contribution Cards */}
        {CARDS.map((card, index) => {
          const position = positions[index];
          return (
            <div
              key={card.id}
              ref={(el) => {
                cardRefs.current[index] = el;
              }}
              className="absolute z-40"
              style={{
                left: `calc(50% + ${position.x}px - 30px)`,
                top: `calc(50% + ${position.y}px + 70px)`,
              }}
            >
              <div className="w-16 rounded-md bg-white border border-deepBlue-100 shadow-xl overflow-hidden">
                <div className="bg-deepBlue-600 text-white text-center text-[7px] py-0.5 font-semibold">
                  AJOSAVE
                </div>
                <div className="p-1.5">
                  <p className="text-[7px] uppercase text-gray-400">
                    Contribution
                  </p>
                  <p className="text-xs font-bold text-deepBlue-700">₦50K</p>
                  <div className="mt-1 flex items-center justify-between">
                    <div className="flex items-center gap-0.5">
                      <div
                        className="w-1.5 h-1.5 rounded-full"
                        style={{
                          background: MEMBERS[index].color,
                        }}
                      />
                      <span className="text-[7px] font-medium text-gray-600">
                        {MEMBERS[index].name}
                      </span>
                    </div>
                    <span className="text-[7px] text-green-600 font-semibold">
                      Paid
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Decorative Background */}
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <div className="absolute left-1/2 top-1/2 w-[480px] h-[380px] rounded-full border border-deepBlue-100 -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute left-1/2 top-1/2 w-[360px] h-[280px] rounded-full border border-dashed border-deepBlue-200 -translate-x-1/2 -translate-y-1/2" />
        </div>
      </div>
    </section>
  );
}