import { Question } from "~/types";

interface QuestionItemProps {
  question: Question;
  onImageClick?: (src: string, alt: string, question: string) => void;
}

export default function QuestionItem(props: QuestionItemProps) {
  return (
    <div class="card">
      <h3 class="text-xl font-semibold text-blue-600 mb-3">Вопрос {props.question.id}</h3>
      <div class="prose prose-sm max-w-none mb-4 text-gray-800" innerHTML={props.question.question} />
      {props.question.imagePath && (
        <div class="mb-4">
          <img
            src={props.question.imagePath}
            alt={`Изображение для вопроса ${props.question.id}`}
            class={`max-w-full h-auto rounded-lg shadow-sm border border-gray-200 ${
              props.onImageClick ? 'cursor-zoom-in hover:opacity-80 transition-opacity' : ''
            }`}
            onClick={props.onImageClick ? () => props.onImageClick!(props.question.imagePath!, `Изображение для вопроса ${props.question.id}`, props.question.question) : undefined}
          />
        </div>
      )}
      <div class="border-t border-gray-200 pt-4">
        <h4 class="text-lg font-semibold text-green-600 mb-2">Ответ:</h4>
        {props.question.answer.includes(';') ? (
          <ul class="list-disc list-inside text-gray-800 leading-relaxed">
            {props.question.answer.split(';').map(a => <li>{a.trim()}</li>)}
          </ul>
        ) : (
          <p class="text-gray-800 leading-relaxed">{props.question.answer}</p>
        )}
      </div>
    </div>
  );
}
