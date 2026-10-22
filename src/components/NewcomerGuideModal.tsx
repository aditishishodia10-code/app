/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  X,
  CreditCard,
  Hand,
  Hash,
  Bell,
  AlertCircle,
  ArrowRightLeft,
  CheckCircle2,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

interface NewcomerGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewcomerGuideModal: React.FC<NewcomerGuideModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Grab Handle for mobile */}
        <div className="sm:hidden pt-3 pb-1 flex justify-center">
          <div className="w-10 h-1.5 bg-slate-200 rounded-full" />
        </div>

        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between gap-3 bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-amber-200" />
            </div>
            <div>
              <span className="text-[11px] font-bold tracking-wider uppercase text-red-100">
                Tourist & Commuter Handbook
              </span>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight">
                Singapore Transit Newcomer Guide
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 text-slate-700 text-sm">
          {/* Tip 1: SimplyGo Payment */}
          <section className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 sm:p-5 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-red-100 text-red-700 flex items-center justify-center shrink-0 font-bold">
                <CreditCard className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">
                1. SimplyGo: Tap In & Tap Out with Your Bank Card
              </h3>
            </div>
            <p className="text-slate-600 leading-relaxed">
              You do <strong>not</strong> need to buy single-journey paper tickets or queue at top-up machines. Singapore public transit supports <strong>SimplyGo contactless payment</strong>.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Accepted:</strong> Foreign or local Visa/Mastercard, Apple Pay, Google Pay, Samsung Pay, NETS, or EZ-Link.
                </span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Always Tap Out:</strong> Tap the exact same card/device at both the entry and exit card readers so distance fares compute accurately.
                </span>
              </div>
            </div>
            <div className="text-xs text-amber-800 bg-amber-50 p-2.5 rounded-lg border border-amber-200">
              💡 <strong>Pro Tip:</strong> Do not tap your whole wallet to the reader. Take your card or phone out to avoid card clash where two cards get detected.
            </div>
          </section>

          {/* Tip 2: 5-Digit Bus Stop Codes */}
          <section className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 sm:p-5 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 font-bold">
                <Hash className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">
                2. The 5-Digit Bus Stop Code System
              </h3>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Every single bus stop in Singapore has a unique <strong>5-digit identifier</strong> (e.g., <code className="font-mono font-bold bg-white px-1.5 py-0.5 rounded border border-slate-200 text-slate-800">09048</code> at Lucky Plaza, <code className="font-mono font-bold bg-white px-1.5 py-0.5 rounded border border-slate-200 text-slate-800">28009</code> at Jurong East).
            </p>
            <div className="p-3.5 bg-white rounded-xl border border-slate-200 text-xs space-y-2">
              <p>
                • <strong>Where to see it:</strong> Look up at the yellow bus stop sign pole or shelter roof beam. The 5-digit number is printed in bold black text.
              </p>
              <p>
                • <strong>"Opp" means Opposite:</strong> If a stop says <em>Opp Orchard Stn</em>, it is on the reverse side of the road heading in the other direction.
              </p>
              <p>
                • <strong>In this app:</strong> Tap any green <strong>Stop #09048</strong> badge to immediately launch Google Maps walking navigation directly to the pole!
              </p>
            </div>
          </section>

          {/* Tip 3: Flagging down buses */}
          <section className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 sm:p-5 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 font-bold">
                <Hand className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">
                3. Flagging Down Your Bus & Alighting
              </h3>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Buses in Singapore <strong>do not automatically stop</strong> just because people are waiting at the shelter.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-slate-900">
                  <Hand className="w-3.5 h-3.5 text-blue-600" />
                  <span>Flag with your hand</span>
                </div>
                <p className="text-slate-600">
                  When you see your bus approaching, step forward safely and raise your hand clearly to signal the captain to pull in.
                </p>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-slate-900">
                  <Bell className="w-3.5 h-3.5 text-red-600" />
                  <span>Press the Bell to Alight</span>
                </div>
                <p className="text-slate-600">
                  Press any red 'BUS STOPPING' bell along the grab poles as soon as the bus departs the previous stop so the driver knows to stop.
                </p>
              </div>
            </div>
          </section>

          {/* Tip 4: Transfers & Etiquette */}
          <section className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 sm:p-5 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center shrink-0 font-bold">
                <ArrowRightLeft className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">
                4. Transfer Rebate & Escalator Etiquette
              </h3>
            </div>
            <ul className="space-y-2 text-xs text-slate-600">
              <li className="flex items-start gap-2">
                <span className="font-bold text-slate-900 shrink-0">• Escalators:</span>
                <span>
                  <strong>Stand on the LEFT</strong> side of escalators; the RIGHT side is kept clear strictly for commuters walking up or down.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-slate-900 shrink-0">• 45-Min Transfer:</span>
                <span>
                  When you transfer from MRT to a bus within 45 minutes, your journey counts as one continuous trip with no new boarding base fare!
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-slate-900 shrink-0">• Strict Rules:</span>
                <span>
                  No eating, drinking (even plain bottled water in stations and carriages), or durians. Fines start from S$500.
                </span>
              </li>
            </ul>
          </section>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3">
          <span className="text-xs text-slate-500 hidden sm:inline">
            Have a smooth journey exploring the Lion City! 🇸🇬
          </span>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs sm:text-sm rounded-xl transition-colors cursor-pointer"
          >
            Got it, Let's Navigate!
          </button>
        </div>
      </div>
    </div>
  );
};
