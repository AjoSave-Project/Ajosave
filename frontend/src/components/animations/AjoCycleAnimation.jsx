import { useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import AdunniImg from "../../assets/images/Adunni.jpg";
import BolajiImg from "../../assets/images/Bolaji.jpg";
import ChiomaImg from "../../assets/images/Chioma.jpg";
import DayoImg   from "../../assets/images/Dayo.jpg";
import EmekaImg  from "../../assets/images/Emeka.jpg";
import FatimaImg from "../../assets/images/Fatima.jpg";

const MEMBERS = [
  { id: 1, name: "Adunni", avatar: AdunniImg, contribution: 50000, color: "#2563eb" },
  { id: 2, name: "Bolaji", avatar: BolajiImg, contribution: 50000, color: "#16a34a" },
  { id: 3, name: "Chioma", avatar: ChiomaImg, contribution: 50000, color: "#9333ea" },
  { id: 4, name: "Dayo",   avatar: DayoImg,   contribution: 50000, color: "#f59e0b" },
  { id: 5, name: "Emeka",  avatar: EmekaImg,  contribution: 50000, color: "#dc2626" },
  { id: 6, name: "Fatima", avatar: FatimaImg, contribution: 50000, color: "#4f46e5" },
];

export const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

// ── Shared timing ─────────────────────────────────────────────────────────
const CONTRIBUTE_DURATION    = 0.55;
const CONTRIBUTE_STAGGER_MS  = 220;
const PAYOUT_DURATION        = 0.9;
const FADE_OUT_DURATION      = 0.3;
const FADE_IN_DURATION       = 0.5;
const FADE_IN_STAGGER        = 0.06;
const PAUSE_BEFORE_PAYOUT_MS = 400;
const PAUSE_BETWEEN_MONTHS   = 500;

const Z_CARD_RESTING = 10;
const Z_POOL         = 30;
const Z_CARD_FLYING  = 50;

const wait    = (ms) => new Promise((r) => setTimeout(r, ms));
const tweenTo = (targets, vars) =>
  new Promise((resolve) => {
    if (!targets || (Array.isArray(targets) && targets.length === 0)) { resolve(); return; }
    gsap.to(targets, { ...vars, onComplete: resolve });
  });

// ─────────────────────────────────────────────────────────────────────────
//  Shared animation logic factory — returns runMonth, cleanup
// ─────────────────────────────────────────────────────────────────────────
function useAnimationLoop({
  memberRefs, cardRefs, stackRef, poolAmountRef,
  positions, cardOffsetY,
  onStepChange, setCurrentMonthIndex, initialMonthIdx,
}) {
  useEffect(() => {
    let cancelled      = false;
    let receiverIndex  = 0;
    let runningTotal   = 0;
    let activeMonthIdx = initialMonthIdx;

    const setPoolLabel = (v) => {
      if (poolAmountRef.current)
        poolAmountRef.current.innerHTML = "₦" + Math.round(v).toLocaleString();
    };

    const pulseStack = () =>
      gsap.fromTo(stackRef.current, { scale:1 }, { scale:1.06, duration:0.18, yoyo:true, repeat:1, ease:"power2.out" });

    const pulseMember = (idx) => {
      const el = memberRefs.current[idx];
      if (el) gsap.fromTo(el, { scale:1 }, { scale:1.15, duration:0.3, yoyo:true, repeat:1, ease:"power2.out" });
    };

    const contribute = async (idx) => {
      const card     = cardRefs.current[idx];
      const home     = positions[idx];
      const newTotal = runningTotal + MEMBERS[idx].contribution;

      const slide = tweenTo(card, {
        x: -home.x,
        y: -(home.y + cardOffsetY),
        rotation: gsap.utils.random(-10, 10),
        scale: 0.85,
        duration: CONTRIBUTE_DURATION,
        ease: "power2.inOut",
      });
      const counter = { value: runningTotal };
      const count = tweenTo(counter, {
        value: newTotal,
        duration: CONTRIBUTE_DURATION,
        ease: "power1.out",
        onUpdate: () => setPoolLabel(counter.value),
      });

      pulseStack();
      await Promise.all([slide, count]);
      runningTotal = newTotal;
    };

    const payout = async () => {
      const rPos = positions[receiverIndex];
      gsap.set(cardRefs.current, { zIndex: Z_CARD_FLYING });
      await tweenTo(cardRefs.current, {
        x:     (i) => rPos.x - positions[i].x,
        y:     (i) => rPos.y - positions[i].y,
        scale: 1,
        duration: PAYOUT_DURATION,
        ease: "power2.inOut",
      });
      pulseMember(receiverIndex);
      const counter = { value: runningTotal };
      await tweenTo(counter, {
        value: 0,
        duration: FADE_OUT_DURATION + 0.15,
        ease: "power1.in",
        onUpdate: () => setPoolLabel(counter.value),
      });
      runningTotal = 0;
    };

    const resetCards = async () => {
      await tweenTo(cardRefs.current, { opacity:0, duration:FADE_OUT_DURATION, stagger:0.04 });
      if (cancelled) return;
      gsap.set(cardRefs.current, { x:0, y:0, rotation:0, scale:0, zIndex:Z_CARD_RESTING });
      await tweenTo(cardRefs.current, { opacity:1, scale:1, duration:FADE_IN_DURATION, stagger:FADE_IN_STAGGER });
    };

    const runMonth = async () => {
      if (cancelled) return;
      const monthName = MONTHS[activeMonthIdx];
      onStepChange?.({ type:"MONTH_START", month:monthName, message:`--- Cycle started for ${monthName} ---` });

      for (let i = 0; i < MEMBERS.length; i++) {
        if (cancelled) return;
        onStepChange?.({
          type: "CONTRIBUTE",
          member: MEMBERS[i].name,
          amount: MEMBERS[i].contribution,
          message: `${MEMBERS[i].name} contributed ₦${(MEMBERS[i].contribution / 1000).toLocaleString()}k`,
        });
        await contribute(i);
        if (i < MEMBERS.length - 1) await wait(CONTRIBUTE_STAGGER_MS);
      }

      if (cancelled) return;
      await wait(PAUSE_BEFORE_PAYOUT_MS);

      const receiver    = MEMBERS[receiverIndex];
      const totalPayout = MEMBERS.length * receiver.contribution;
      onStepChange?.({
        type: "PAYOUT",
        member: receiver.name,
        amount: totalPayout,
        message: `${receiver.name} has been paid the cycle's pool of ₦${(totalPayout / 1000).toLocaleString()}k!`,
      });

      if (cancelled) return;
      await payout();
      if (cancelled) return;
      await resetCards();
      if (cancelled) return;

      receiverIndex  = (receiverIndex  + 1) % MEMBERS.length;
      activeMonthIdx = (activeMonthIdx + 1) % 12;
      setCurrentMonthIndex(activeMonthIdx);

      await wait(PAUSE_BETWEEN_MONTHS);
      if (!cancelled) runMonth();
    };

    // Kick off
    gsap.set(memberRefs.current, { scale:1, opacity:1 });
    gsap.set(cardRefs.current,   { opacity:0, scale:0, zIndex:Z_CARD_RESTING });
    if (stackRef.current) gsap.set(stackRef.current, { scale:1 });
    setPoolLabel(0);

    tweenTo(cardRefs.current, {
      opacity: 1, scale: 1,
      duration: FADE_IN_DURATION,
      delay: 0.3,
      stagger: FADE_IN_STAGGER,
    }).then(() => { if (!cancelled) runMonth(); });

    return () => {
      cancelled = true;
      gsap.killTweensOf([
        ...(cardRefs.current   || []),
        ...(memberRefs.current || []),
        stackRef.current,
      ].filter(Boolean));
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

// ─────────────────────────────────────────────────────────────────────────
//  DESKTOP  (horizontal row of 6, pool centred below)
// ─────────────────────────────────────────────────────────────────────────
const D_WIDTH    = 1000;
const D_HEIGHT   = 480;   // taller to give pool more vertical breathing room
const D_ROW_Y    = -200;  // members pushed higher so pool sits lower in canvas
const D_GAP      = 155;
const D_CARD_DY  = 72;

function DesktopAnimation({ onStepChange, currentMonthIndex, setCurrentMonthIndex }) {
  const containerRef  = useRef(null);
  const memberRefs    = useRef([]);
  const cardRefs      = useRef([]);
  const stackRef      = useRef(null);
  const poolAmountRef = useRef(null);

  const positions = useMemo(() => {
    const mid = (MEMBERS.length - 1) / 2;
    return MEMBERS.map((_, i) => ({ x: (i - mid) * D_GAP, y: D_ROW_Y }));
  }, []);

  useAnimationLoop({
    memberRefs, cardRefs, stackRef, poolAmountRef,
    positions, cardOffsetY: D_CARD_DY,
    onStepChange, setCurrentMonthIndex, initialMonthIdx: currentMonthIndex,
  });

  return (
    <div ref={containerRef} className="relative" style={{ width:D_WIDTH, height:D_HEIGHT }}>
      {/* Guide lines */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute left-1/2 border-t border-dashed border-deepBlue-200"
          style={{ top:`calc(50% + ${D_ROW_Y}px)`, width:D_WIDTH-140, transform:"translateX(-50%)" }} />
        <div className="absolute left-1/2 border-l border-dashed border-deepBlue-100"
          style={{ top:`calc(50% + ${D_ROW_Y}px)`, height:Math.abs(D_ROW_Y), transform:"translateX(-50%)" }} />
      </div>

      {/* Pool */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ zIndex:Z_POOL }}>
        <div ref={stackRef} className="relative w-52 h-24 rounded-2xl bg-gradient-to-br from-deepBlue-600 to-deepBlue-800 shadow-2xl flex flex-col justify-center items-center text-white">
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-32 h-2 rounded-full bg-white/10" />
          <p className="text-xs uppercase tracking-widest opacity-70 mb-1">Pool</p>
          <h2 ref={poolAmountRef} className="text-3xl font-semibold">₦0</h2>
        </div>
      </div>

      {/* Members */}
      {MEMBERS.map((member, i) => {
        const pos = positions[i];
        return (
          <div key={member.id} className="absolute"
            style={{ left:`calc(50% + ${pos.x}px)`, top:`calc(50% + ${pos.y}px)`, transform:"translate(-50%,-50%)" }}>
            <div ref={(el) => { memberRefs.current[i] = el; }} className="flex flex-col items-center gap-2">
              <div className="w-24 h-24 rounded-2xl overflow-hidden border-4 border-white shadow-2xl">
                <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
              </div>
              <h3 className="text-sm font-semibold text-deepBlue-800">{member.name}</h3>
            </div>
          </div>
        );
      })}

      {/* Contribution cards */}
      {MEMBERS.map((member, i) => {
        const pos = positions[i];
        return (
          <div key={member.id} ref={(el) => { cardRefs.current[i] = el; }}
            className="absolute"
            style={{ left:`calc(50% + ${pos.x}px)`, top:`calc(50% + ${pos.y + D_CARD_DY}px)`, transform:"translate(-50%,0)", zIndex:Z_CARD_RESTING }}>
            <div className="w-[78px] rounded-lg bg-white border border-deepBlue-100 shadow-xl overflow-hidden">
              <div className="bg-deepBlue-600 text-white text-center text-[8px] py-0.5 font-semibold tracking-wider">AJOSAVE</div>
              <div className="p-2 text-center">
                <p className="text-xs font-bold text-deepBlue-700">₦50K</p>
                <div className="mt-1 flex items-center justify-center gap-1">
                  <div className="w-2 h-2 rounded-full" style={{ background:member.color }} />
                  <span className="text-[8px] font-medium text-gray-600">{member.name}</span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
//  MOBILE  layout:
//
//   Row A  (top)   : members 0 1 2   (y = -180)
//   Pool            :                 (y =    0)   ← centred
//   Row B  (bottom) : members 3 4 5   (y = +155)
//
//  Contribution cards sit just below their avatar (y + 60).
//  Pool is at the canvas centre (y=0) so cards from both rows converge on it.
// ─────────────────────────────────────────────────────────────────────────
const M_COL_GAP  = 108;   // horizontal gap between member centres
const M_ROW_A_Y  = -178;  // top-row member y  (relative to canvas centre)
const M_ROW_B_Y  =  152;  // bottom-row member y — pushed down for card breathing room
const M_CARD_DY  =  60;   // contribution card sits this far below avatar centre
const M_WIDTH    =  340;
const M_HEIGHT   =  550;  // extra height so bottom-row cards aren't clipped

// Positions for all 6 members — top row (0-2) then bottom row (3-5)
const mobilePositions = MEMBERS.map((_, i) => {
  const col = i % 3;            // 0 1 2
  const isBottom = i >= 3;
  const x = (col - 1) * M_COL_GAP;
  const y = isBottom ? M_ROW_B_Y : M_ROW_A_Y;
  return { x, y };
});

function MobileAnimation({ onStepChange, currentMonthIndex, setCurrentMonthIndex }) {
  const containerRef  = useRef(null);
  const memberRefs    = useRef([]);
  const cardRefs      = useRef([]);
  const stackRef      = useRef(null);
  const poolAmountRef = useRef(null);

  useAnimationLoop({
    memberRefs, cardRefs, stackRef, poolAmountRef,
    positions: mobilePositions, cardOffsetY: M_CARD_DY,
    onStepChange, setCurrentMonthIndex, initialMonthIdx: currentMonthIndex,
  });

  return (
    <div
      ref={containerRef}
      className="relative mx-auto overflow-hidden"
      style={{ width: M_WIDTH, height: M_HEIGHT }}
    >
      {/* Vertical guide line from top-row centre down to pool */}
      <div className="absolute left-1/2 -translate-x-1/2 border-l border-dashed border-deepBlue-100/40 pointer-events-none"
        style={{ top:`calc(50% + ${M_ROW_A_Y}px)`, height: Math.abs(M_ROW_A_Y) }} />
      {/* Vertical guide line from pool down to bottom-row */}
      <div className="absolute left-1/2 -translate-x-1/2 border-l border-dashed border-deepBlue-100/40 pointer-events-none"
        style={{ top:`50%`, height: M_ROW_B_Y }} />

      {/* Pool — pinned at canvas centre */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ zIndex:Z_POOL }}>
        <div ref={stackRef} className="w-28 h-14 rounded-xl bg-gradient-to-br from-deepBlue-600 to-deepBlue-800 shadow-2xl flex flex-col justify-center items-center text-white">
          <p className="text-[9px] uppercase tracking-widest opacity-70 mb-0.5">Pool</p>
          <h2 ref={poolAmountRef} className="text-base font-semibold">₦0</h2>
        </div>
      </div>

      {/* Members */}
      {MEMBERS.map((member, i) => {
        const pos = mobilePositions[i];
        return (
          <div key={member.id} className="absolute"
            style={{ left:`calc(50% + ${pos.x}px)`, top:`calc(50% + ${pos.y}px)`, transform:"translate(-50%,-50%)" }}>
            <div ref={(el) => { memberRefs.current[i] = el; }} className="flex flex-col items-center gap-1">
              <div className="w-[58px] h-[58px] rounded-xl overflow-hidden border-[3px] border-white shadow-lg">
                <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
              </div>
              <h3 className="text-[10px] font-semibold text-deepBlue-200">{member.name}</h3>
            </div>
          </div>
        );
      })}

      {/* Contribution cards */}
      {MEMBERS.map((member, i) => {
        const pos = mobilePositions[i];
        return (
          <div key={member.id} ref={(el) => { cardRefs.current[i] = el; }}
            className="absolute"
            style={{
              left:      `calc(50% + ${pos.x}px)`,
              top:       `calc(50% + ${pos.y + M_CARD_DY}px)`,
              transform: "translate(-50%, 0)",
              zIndex:    Z_CARD_RESTING,
            }}>
            <div className="w-[60px] rounded-md bg-white border border-deepBlue-100 shadow-lg overflow-hidden">
              <div className="bg-deepBlue-600 text-white text-center text-[7px] py-0.5 font-semibold tracking-wider">AJOSAVE</div>
              <div className="p-1.5 text-center">
                <p className="text-[10px] font-bold text-deepBlue-700">₦50K</p>
                <div className="mt-0.5 flex items-center justify-center gap-0.5">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background:member.color }} />
                  <span className="text-[7px] font-medium text-gray-600">{member.name}</span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
//  ROOT EXPORT
//  - No month badge here (month is shown in the terminal narrator instead)
//  - overflow-hidden on the wrapper kills the horizontal scrollbar on mobile
// ─────────────────────────────────────────────────────────────────────────
export default function AjoCycleAnimation({ onStepChange }) {
  const [currentMonthIndex, setCurrentMonthIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  return (
    <div className="w-full overflow-hidden flex justify-center py-4 sm:py-6">
      {isMobile ? (
        <MobileAnimation
          onStepChange={onStepChange}
          currentMonthIndex={currentMonthIndex}
          setCurrentMonthIndex={setCurrentMonthIndex}
        />
      ) : (
        <DesktopAnimation
          onStepChange={onStepChange}
          currentMonthIndex={currentMonthIndex}
          setCurrentMonthIndex={setCurrentMonthIndex}
        />
      )}
    </div>
  );
}
