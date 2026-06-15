import { useEffect, useState } from "react";

const TIMER_DURATION = 5 * 60 * 1000;
const MAX_TRIALS = 50;

export const ResendTimer = () => {
  const [trials, setTrials] = useState(() => {
    const savedTrials =
      localStorage.getItem("resend_trials");

    return savedTrials
      ? Number(savedTrials)
      : 0;
  });

  const [remainingTime, setRemainingTime] =
    useState(() => {
      const savedExpireTime =
        localStorage.getItem(
          "resend_expire_time"
        );

      if (!savedExpireTime) return 0;

      const timeLeft =
        Number(savedExpireTime) - Date.now();

      return timeLeft > 0 ? timeLeft : 0;
    });

  useEffect(() => {
    if (remainingTime <= 0) return;

    const interval = setInterval(() => {
      const expireTime = Number(
        localStorage.getItem(
          "resend_expire_time"
        )
      );

      const timeLeft = expireTime - Date.now();

      if (timeLeft <= 0) {
        clearInterval(interval);

        setRemainingTime(0);

        localStorage.removeItem(
          "resend_expire_time"
        );

        return;
      }

      setRemainingTime(timeLeft);
    }, 1000);

    return () => clearInterval(interval);
  }, [remainingTime]);

  const startTimer = () => {
    if (trials >= MAX_TRIALS) return;

    const expireTime =
      Date.now() + TIMER_DURATION;

    localStorage.setItem(
      "resend_expire_time",
      expireTime.toString()
    );

    const updatedTrials = trials + 1;

    localStorage.setItem(
      "resend_trials",
      updatedTrials.toString()
    );

    setTrials(updatedTrials);

    setRemainingTime(TIMER_DURATION);
  };

  const resetTimer = () => {
    localStorage.removeItem(
      "resend_expire_time"
    );

    localStorage.removeItem("resend_trials");

    setRemainingTime(0);

    setTrials(0);
  };

  const formattedTime = (() => {
    const totalSeconds = Math.floor(
      remainingTime / 1000
    );

    const minutes = Math.floor(
      totalSeconds / 60
    );

    const seconds = totalSeconds % 60;

    return `${String(minutes).padStart(
      2,
      "0"
    )}:${String(seconds).padStart(2, "0")}`;
  })();

  const isDisabled =
    remainingTime > 0 || trials >= MAX_TRIALS;

  const trialsLeft = MAX_TRIALS - trials;

  return {
    remainingTime,
    formattedTime,
    isDisabled,
    trials,
    trialsLeft,
    startTimer,
    resetTimer,
  };
};