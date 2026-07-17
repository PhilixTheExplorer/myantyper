"use client";

import { useState } from "react";
import {
  A,
  Article,
  ArticleCTA,
  ArticleHeader,
  Section,
} from "@/components/ui/Article";
import { cn } from "@/lib/utils";

type GuideLanguage = "en" | "my";

export function GuideContent({ firstLessonId }: { firstLessonId: string }) {
  const [language, setLanguage] = useState<GuideLanguage>("en");

  return (
    <Article>
      <fieldset className="mb-7 inline-grid grid-cols-2 border border-border-soft">
        <legend className="sr-only">Guide language</legend>
        <LanguageButton
          active={language === "en"}
          label="English"
          onClick={() => setLanguage("en")}
        />
        <LanguageButton
          active={language === "my"}
          label="မြန်မာ"
          onClick={() => setLanguage("my")}
        />
      </fieldset>

      {language === "en" ? (
        <EnglishGuide firstLessonId={firstLessonId} />
      ) : (
        <MyanmarGuide firstLessonId={firstLessonId} />
      )}
    </Article>
  );
}

function LanguageButton({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "mt-action min-h-10 px-4 text-xs tracking-widest uppercase",
        active ? "bg-accent text-accent-ink" : "mt-action-quiet text-ink-soft",
      )}
    >
      {label}
    </button>
  );
}

function EnglishGuide({ firstLessonId }: { firstLessonId: string }) {
  return (
    <div lang="en">
      <ArticleHeader
        eyebrow="Learner guide"
        title="How to use MyanTyper"
        lead="Start with guided physical-key practice, understand Visual-order input, then reduce the scaffolding as your muscle memory improves."
      />

      <Section title="Start practising">
        <ol className="list-decimal space-y-2 pl-5">
          <li>
            Open <A href="/lessons">Lessons</A> and begin with{" "}
            <strong>Keyboard Foundations</strong>.
          </li>
          <li>Watch the highlighted key on the on-screen keyboard.</li>
          <li>
            Press that key on your physical keyboard. MyanTyper shows when Shift
            is required.
          </li>
          <li>
            Complete the lesson, then review your speed, accuracy, active time,
            and rhythm.
          </li>
        </ol>
      </Section>

      <Section title="Keys mode and Reader mode">
        <ModeCards language="en" />
        <p>
          Both modes expect the same physical keys and preserve your current
          progress. Structured lessons start in Keys mode; Free Type starts in
          Reader mode. You can switch at any time.
        </p>
      </Section>

      <Section title="Visual-order typing">
        <p>
          The order displayed on screen can differ from the order typed. For
          example, <span lang="my">ဖေ</span> is stored and displayed as normal
          Unicode, but the Windows Visual-order keyboard expects{" "}
          <span lang="my">ေ</span> before <span lang="my">ဖ</span>. Keys mode
          makes that input sequence explicit.
        </p>
        <p>
          Read more about the{" "}
          <A href="/myanmar-keyboard">Windows Myanmar keyboard</A> and why{" "}
          <A href="/myanmar-unicode">Unicode order matters</A>.
        </p>
      </Section>

      <Section title="Free Type">
        <p>
          <A href="/free">Free Type</A> turns your own Myanmar Unicode text into
          a practice session. Paste Unicode—not Zawgyi—and use Reader mode for
          natural text or switch to Keys when you need the input-order rail.
        </p>
      </Section>

      <Section title="Progress and privacy">
        <p>
          The current release stores lesson history and appearance preferences
          in this browser. Clearing the site&apos;s browser data removes them.
          There are no ads, no tracking, and no account is required.
        </p>
      </Section>

      <Section title="Need help?">
        <p>
          Report spelling, keyboard-order, lesson, or accessibility problems on{" "}
          <A href="https://github.com/PhilixTheExplorer/myantyper/issues">
            GitHub Issues
          </A>
          {". Report security concerns privately through the project's "}
          <A href="https://github.com/PhilixTheExplorer/myantyper/security/advisories/new">
            security advisory form
          </A>
          {"."}
        </p>
      </Section>

      <ArticleCTA
        href={`/practice/${firstLessonId}`}
        label="Start Keyboard Foundations"
        note="Keys mode is selected for your first structured lesson."
      />
    </div>
  );
}

function MyanmarGuide({ firstLessonId }: { firstLessonId: string }) {
  return (
    <div lang="my" className="mt-myanmar">
      <ArticleHeader
        eyebrow="အသုံးပြုနည်း"
        title="MyanTyper ကို စတင်အသုံးပြုနည်း"
        lead="Windows Myanmar (Visual order) ကီးဘုတ်ဖြင့် မြန်မာယူနီကုဒ်စာကို လက်ကွက်ဖြင့် မှန်ကန်စွာရိုက်တတ်စေရန် အဆင့်လိုက်လေ့ကျင့်ပါ။"
      />

      <Section title="စတင်လေ့ကျင့်ရန်">
        <ol className="list-decimal space-y-2 pl-5 text-base">
          <li>
            ပထမစာမျက်နှာမှ <strong>Keyboard Foundations</strong> ကိုရွေးပါ။
          </li>
          <li>သင်ခန်းစာတစ်ခုကိုဖွင့်ပြီး ကီးဘုတ်ပေါ်တွင် မီးလင်းပြသော ခလုတ်ကိုကြည့်ပါ။</li>
          <li>
            သတ်မှတ်ထားသော အက္ခရာကို physical keyboard ဖြင့်ရိုက်ပါ။ Shift လိုအပ်လျှင် MyanTyper
            က ပြပေးသည်။
          </li>
          <li>သင်ခန်းစာပြီးလျှင် အမြန်နှုန်း၊ မှန်ကန်မှုနှင့် လေ့ကျင့်ချိန်ကို ပြန်ကြည့်ပါ။</li>
        </ol>
      </Section>

      <Section title="Keys mode နှင့် Reader mode">
        <ModeCards language="my" />
        <p className="text-base">
          Mode နှစ်ခုလုံးတွင် တူညီသော physical key များကိုနှိပ်ရပြီး mode ပြောင်းလဲသော်လည်း
          လက်ရှိလေ့ကျင့်မှု မပျက်ပါ။ သင်ခန်းစာများကို Keys mode ဖြင့် စတင်ပြီး Free Type ကို Reader
          mode ဖြင့် စတင်သည်။
        </p>
      </Section>

      <Section title="Visual-order ရိုက်စဉ်">
        <p className="text-base">
          မျက်နှာပြင်ပေါ်တွင် မြင်ရသည့်အစဉ်နှင့် ကီးနှိပ်ရမည့်အစဉ် မတူနိုင်ပါ။ ဥပမာ{" "}
          <span lang="my">ဖေ</span> ကို ပုံမှန်ယူနီကုဒ်အစဉ်အတိုင်း ပြသသော်လည်း Visual-order
          ကီးဘုတ်တွင် <span lang="my">'‌ေ'</span> ကို အရင်နှိပ်ပြီး{" "}
          <span lang="my">'ဖ'</span> ကို နောက်မှနှိပ်ရသည်။ Keys mode သည် ဤရိုက်စဉ်ကို
          သီးခြားပြပေးသည်။
        </p>
        <p className="text-base">
          <A href="/myanmar-keyboard">Windows Myanmar ကီးဘုတ်</A> နှင့်{" "}
          <A href="/myanmar-unicode">Myanmar Unicode</A> အကြောင်းကိုလည်း
          ဆက်လက်ဖတ်ရှုနိုင်သည်။
        </p>
      </Section>

      <Section title="Free Type">
        <p className="text-base">
          ကိုယ်တိုင်လေ့ကျင့်လိုသော ယူနီကုဒ်မြန်မာစာကို <A href="/free">Free Type</A> တွင် ကူးထည့်၍
          ရိုက်နိုင်သည်။ Zawgyi စာမဟုတ်ဘဲ Unicode စာကို အသုံးပြုပါ။ စာတစ်ကြောင်းစီကို အာရုံစိုက်ရိုက်ပြီး
          လိုအပ်လျှင် Keys mode သို့ပြောင်းကာ ရိုက်စဉ်ကိုကြည့်ပါ။
        </p>
      </Section>

      <Section title="မှတ်တမ်းနှင့် ကိုယ်ရေးအချက်အလက်">
        <p className="text-base">
          လက်ရှိ version တွင် လေ့ကျင့်မှတ်တမ်းနှင့် အပြင်အဆင်ရွေးချယ်မှုများကို ဤ browser ထဲတွင်သာ
          သိမ်းထားသည်။ Browser ၏ site data ကိုရှင်းလျှင် ထိုဒေတာများ ပျက်မည်ဖြစ်သည်။ ကြော်ငြာနှင့်
          ခြေရာခံစနစ်မရှိသလို အကောင့်လည်း မလိုအပ်ပါ။
        </p>
      </Section>

      <Section title="အကူအညီလိုပါသလား">
        <p className="text-base">
          စာလုံးပေါင်း၊ ရိုက်စဉ်၊ သင်ခန်းစာစာသား သို့မဟုတ် အသုံးပြုရခက်ခဲသောအချက်ကို တွေ့ပါက{" "}
          <A href="https://github.com/PhilixTheExplorer/myantyper/issues">
            GitHub Issues
          </A>
          တွင် အသိပေးနိုင်ပါသည်။ လုံခြုံရေးဆိုင်ရာ အချက်အလက်များကို{" "}
          <A href="https://github.com/PhilixTheExplorer/myantyper/security/advisories/new">
            security advisory form
          </A>
          မှတစ်ဆင့် သီးသန့် အသိပေးပါ။
        </p>
      </Section>

      <ArticleCTA
        href={`/practice/${firstLessonId}`}
        label="Keyboard Foundations စတင်ရန်"
        note="ပထမသင်ခန်းစာကို Keys mode ဖြင့် စတင်မည်။"
      />
    </div>
  );
}

function ModeCards({ language }: { language: GuideLanguage }) {
  const myanmar = language === "my";

  return (
    <div id="practice-modes" className="grid scroll-mt-24 gap-3 sm:grid-cols-2">
      <div className="border border-border-soft bg-surface-2 p-4">
        <h3 className="mt-display mb-2 text-xl text-ink">Keys</h3>
        <p className={cn(myanmar && "text-base")}>
          {myanmar
            ? "ရိုက်ရမည့်ခလုတ်အစဉ်ကို တစ်လုံးချင်းပြသပေးသောကြောင့် Visual-order စတင်လေ့လာရာတွင် အသုံးဝင်သည်။"
            : "Shows readable Myanmar text plus a separate physical input-order rail. Use it while learning new keys or Visual-order sequences."}
        </p>
      </div>
      <div className="border border-border-soft bg-surface-2 p-4">
        <h3 className="mt-display mb-2 text-xl text-ink">Reader</h3>
        <p className={cn(myanmar && "text-base")}>
          {myanmar
            ? "ပုံမှန်ပုံသဏ္ဌာန်ရှိသော မြန်မာစာကိုသာ အဓိကပြသသည်။ ကီးဘုတ်အကူအညီဖြင့် ဖတ်ရင်းရိုက်ချင်သောအခါ သင့်တော်သည်။"
            : "Keeps the focus on naturally shaped Myanmar without the input-order rail. Use it when you are ready to practise recall and fluency."}
        </p>
      </div>
    </div>
  );
}
