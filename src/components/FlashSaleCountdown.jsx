import { useEffect, useState } from "react";
import { supabase } from "../supabase-client"; // update path

export default function FlashSaleCountdown({ saleId = 1 }) {
  const [sale, setSale] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  function getTimeLeft(targetDate) {
    const now = new Date();
    const diff = targetDate - now;

    if (diff <= 0) return null;

    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    };
  }

  async function fetchSale() {
    const { data, error } = await supabase
      .from("flash_sales")
      .select("*")
      .eq("id", saleId)
      .maybeSingle();

    if (error) {
      console.error("Error fetching sale:", error);
      return;
    }
    setSale(data);
  }

  useEffect(() => {
    fetchSale();
  }, [saleId]);

  useEffect(() => {
    if (!sale || !sale.active) return;

    const end = new Date(sale.ends_at);

    const interval = setInterval(() => {
      const t = getTimeLeft(end);

      if (!t) {
        clearInterval(interval);
        setTimeLeft(null);

        supabase.from("flash_sales").update({ active: false }).eq("id", saleId);

        return;
      }

      setTimeLeft(t);
    }, 1000);

    return () => clearInterval(interval);
  }, [sale]);

  if (!sale) return null;

  return (
    <div className="max-w-xl mx-auto bg-yellow-50 p-6 rounded-xl shadow border border-yellow-200">
      <h2 className="text-2xl font-bold text-gray-900">{sale.title}</h2>
      <p className="text-sm text-gray-600 mb-4">
        Limited time — grab it before it's gone!
      </p>

      {timeLeft ? (
        <div className="flex justify-between bg-yellow-100 p-3 rounded-lg text-center">
          <div>
            <div className="text-xs font-medium uppercase">Days</div>
            <div className="text-lg font-bold">{pad(timeLeft.days)}</div>
          </div>
          <div>
            <div className="text-xs font-medium uppercase">Hours</div>
            <div className="text-lg font-bold">{pad(timeLeft.hours)}</div>
          </div>
          <div>
            <div className="text-xs font-medium uppercase">Min</div>
            <div className="text-lg font-bold">{pad(timeLeft.minutes)}</div>
          </div>
          <div>
            <div className="text-xs font-medium uppercase">Sec</div>
            <div className="text-lg font-bold">{pad(timeLeft.seconds)}</div>
          </div>
        </div>
      ) : (
        <div className="w-full py-2 bg-gray-200 rounded-lg text-center font-medium">
          Sale Ended
        </div>
      )}

      <button
        onClick={() => (window.location.href = "/")}
        className="mt-5 w-full py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-lg"
      >
        Shop Now
      </button>
    </div>
  );
}
