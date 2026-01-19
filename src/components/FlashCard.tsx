import { createSignal } from "solid-js";
import { Question } from "~/types";
import ImageModal from "./ImageModal";

interface FlashCardProps {
  question: Question;
  onNext: () => void;
  onPrev: () => void;
  currentIndex: number;
  total: number;
  isFlipped: boolean;
  onFlipChange: (flipped: boolean) => void;
}

export default function FlashCard(props: FlashCardProps) {
  const [isModalOpen, setIsModalOpen] = createSignal(false);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === ' ') {
      e.preventDefault();
      props.onFlipChange(!props.isFlipped);
    } else if (e.key === 'ArrowLeft' && props.currentIndex > 0) {
      props.onPrev();
    } else if (e.key === 'ArrowRight' && props.currentIndex < props.total - 1) {
      props.onNext();
    }
  };

  const handleImageClick = (e: MouseEvent) => {
    e.stopPropagation(); // Prevent card flip when clicking on image
    setIsModalOpen(true);
  };

  return (
    <div class="mx-auto max-w-2xl min-h-96 mb-8">
      {/* Image Modal */}
      <ImageModal
        src={props.question.imagePath || ''}
        alt={`Изображение для вопроса ${props.question.id}`}
        question={props.question.question}
        isOpen={isModalOpen()}
        onClose={() => setIsModalOpen(false)}
      />

      <div
        class="relative w-full h-96 text-center"
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="button"
        aria-label={`Вопрос ${props.question.id}. Нажмите пробел для переворота карточки, стрелки для навигации.`}
      >
        {/* Clickable overlay for card flipping */}
        <div
          class="absolute inset-0 cursor-pointer z-10"
          onClick={() => props.onFlipChange(!props.isFlipped)}
          style="pointer-events: auto;"
        />

        {/* Front of card */}
        <div class={`absolute inset-0 question-card flex flex-col justify-center items-center transition-opacity duration-700 ${
          props.isFlipped ? 'opacity-0' : 'opacity-100'
        }`}>
          <h3 class="text-blue-600 text-xl font-semibold mb-4">Вопрос {props.question.id}</h3>
          <div class="mb-4 text-gray-800 prose prose-sm max-w-none" innerHTML={props.question.question} />
          {props.question.imagePath && (
            <img
              src={props.question.imagePath}
              alt={`Изображение для вопроса ${props.question.id}`}
              class="w-full max-h-64 object-contain rounded-lg shadow-sm cursor-zoom-in hover:opacity-80 transition-opacity relative z-20"
              onClick={handleImageClick}
              style="pointer-events: auto;"
            />
          )}
          <p class="mt-4 text-gray-500 italic text-sm">
            Нажмите, чтобы увидеть ответ
          </p>
        </div>

        {/* Back of card */}
        <div class={`absolute inset-0 answer-card flex flex-col justify-center items-center transition-opacity duration-700 ${
          props.isFlipped ? 'opacity-100' : 'opacity-0'
        }`}>
          <h3 class="text-green-600 text-xl font-semibold mb-4">Ответ</h3>
          {props.question.answer.includes(';') ? (
            <ul class="list-disc list-inside text-lg leading-relaxed text-gray-800 text-center px-4">
              {props.question.answer.split(';').map((a: string) => <li>{a.trim()}</li>)}
            </ul>
          ) : (
            <p class="text-lg leading-relaxed text-gray-800 text-center px-4">{props.question.answer}</p>
          )}
          <p class="mt-4 text-gray-500 italic text-sm">
            Нажмите, чтобы увидеть вопрос снова
          </p>
        </div>
      </div>

      {/* Navigation */}
      <div class="flex justify-center items-center gap-4 mt-6">
        <button
          onClick={props.onPrev}
          disabled={props.currentIndex === 0}
          class={`px-6 py-2 rounded-lg font-medium transition-colors duration-200 ${
            props.currentIndex === 0
              ? 'bg-gray-400 cursor-not-allowed text-gray-200'
              : 'btn-primary hover:bg-blue-700'
          }`}
        >
          Предыдущий
        </button>
        <span class="text-gray-600 font-medium">
          {props.currentIndex + 1} из {props.total}
        </span>
        <button
          onClick={props.onNext}
          disabled={props.currentIndex === props.total - 1}
          class={`px-6 py-2 rounded-lg font-medium transition-colors duration-200 ${
            props.currentIndex === props.total - 1
              ? 'bg-gray-400 cursor-not-allowed text-gray-200'
              : 'btn-primary hover:bg-blue-700'
          }`}
        >
          Следующий
        </button>
      </div>
    </div>
  );
}
