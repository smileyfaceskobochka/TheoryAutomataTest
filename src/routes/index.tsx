import { Title } from "@solidjs/meta";
import { For, createSignal, createEffect, Show, createMemo, onMount, createResource } from "solid-js";
import { Question, Mode } from "~/types";
import FlashCard from "~/components/FlashCard";
import QuestionItem from "~/components/QuestionItem";
import ModeSelector from "~/components/ModeSelector";
import ImageModal from "~/components/ImageModal";

const loadQuestions = async (): Promise<Question[]> => {
  const questionsData = await import("~/questions.json");
  return questionsData.default as Question[];
};

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function Home() {
  const [refetchTrigger, setRefetchTrigger] = createSignal(0);
  const [questionsResource] = createResource(refetchTrigger, loadQuestions);
  const [mode, setMode] = createSignal<Mode>("list");
  const [shuffledQuestions, setShuffledQuestions] = createSignal<Question[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = createSignal(0);
  const [cardFlipped, setCardFlipped] = createSignal(false);
  const [modalImage, setModalImage] = createSignal<{src: string; alt: string; question: string} | null>(null);

  // List mode state
  const [search, setSearch] = createSignal("");
  const [loadedCount, setLoadedCount] = createSignal(20);
  const [sentinelRef, setSentinelRef] = createSignal<HTMLDivElement>();

  const allQuestions = () => questionsResource() || [];

  const filteredQuestions = createMemo(() =>
    allQuestions().filter((q: Question) =>
      q.question.toLowerCase().includes(search().toLowerCase()) ||
      q.id.toString().includes(search())
    )
  );

  const displayedQuestions = createMemo(() =>
    filteredQuestions().slice(0, loadedCount())
  );

  createEffect(() => {
    // Reset loaded count when search changes
    setLoadedCount(20);
  });

  let observer: IntersectionObserver | null = null;

  onMount(() => {
    observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && loadedCount() < filteredQuestions().length) {
        setLoadedCount(loadedCount() + 20);
      }
    });
  });

  createEffect(() => {
    if (mode() === "list" && sentinelRef() && observer) {
      observer.observe(sentinelRef()!);
    } else if (observer) {
      observer.disconnect();
    }
  });

  const shuffleQuestions = () => {
    setShuffledQuestions(shuffleArray(allQuestions()));
    setCurrentCardIndex(0);
    setMode("cards");
  };

  const switchToListMode = () => {
    setMode("list");
    setLoadedCount(20); // Reset loaded count when switching back to list
  };

  const nextCard = () => {
    if (currentCardIndex() < shuffledQuestions().length - 1) {
      setCurrentCardIndex(currentCardIndex() + 1);
      setCardFlipped(false); // Reset flip state when changing cards
    }
  };

  const prevCard = () => {
    if (currentCardIndex() > 0) {
      setCurrentCardIndex(currentCardIndex() - 1);
      setCardFlipped(false); // Reset flip state when changing cards
    }
  };



  return (
    <main class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4">
      <Title>Сервис подготовки к экзаменам</Title>

      <div class="max-w-6xl mx-auto">
        {/* Navigation */}
        <nav class="flex justify-end mb-4">
          <a
            href="/about"
            class="text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200"
          >
            О программе
          </a>
        </nav>

        <div class="text-center mb-8">
          <h1 class="text-4xl md:text-5xl font-bold text-gray-800 mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Теория автоматов
          </h1>
          <p class="text-xl text-gray-600 font-medium">Сервис подготовки к экзаменам</p>
        </div>

        <Show when={questionsResource.loading}>
          <div class="flex justify-center items-center py-16">
            <div class="text-center">
              <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p class="text-gray-600">Загрузка вопросов...</p>
            </div>
          </div>
        </Show>

        <Show when={questionsResource.error}>
          <div class="text-center py-16">
            <div class="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
              <h3 class="text-red-800 font-semibold mb-2">Ошибка загрузки вопросов</h3>
              <p class="text-red-600 text-sm">{questionsResource.error?.message || "Произошла ошибка при загрузке вопросов."}</p>
              <button
                onClick={() => setRefetchTrigger(prev => prev + 1)}
                class="mt-4 btn-primary"
              >
                Попробовать снова
              </button>
            </div>
          </div>
        </Show>

        <Show when={!questionsResource.loading && !questionsResource.error}>
          <ModeSelector
            mode={mode()}
            onListMode={switchToListMode}
            onShuffle={shuffleQuestions}
          />
        </Show>

        <Show when={mode() === "list"}>
          {/* Search */}
          <div class="mb-6">
            <input
              type="text"
              placeholder="Поиск по тексту вопроса или номеру..."
              value={search()}
              onInput={(e) => setSearch(e.target.value)}
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Questions List */}
          <div class="space-y-6">
            <For each={displayedQuestions()}>
              {(q: Question) => (
                <QuestionItem
                  question={q}
                  onImageClick={(src, alt, question) => setModalImage({ src, alt, question })}
                />
              )}
            </For>
            <div ref={setSentinelRef} class="h-10"></div>
          </div>
        </Show>

        <Show when={mode() === "cards" && shuffledQuestions().length > 0}>
          <FlashCard
            question={shuffledQuestions()[currentCardIndex()]}
            onNext={nextCard}
            onPrev={prevCard}
            currentIndex={currentCardIndex()}
            total={shuffledQuestions().length}
            isFlipped={cardFlipped()}
            onFlipChange={setCardFlipped}
          />
        </Show>

        {/* Global Image Modal */}
        <ImageModal
          src={modalImage()?.src || ''}
          alt={modalImage()?.alt || ''}
          question={modalImage()?.question || ''}
          isOpen={modalImage() !== null}
          onClose={() => setModalImage(null)}
        />
      </div>
    </main>
  );
}
