import { createSignal, onMount, onCleanup, Show, on } from "solid-js";
import { isServer } from "solid-js/web";

interface ImageModalProps {
  src: string;
  alt: string;
  question: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function ImageModal(props: ImageModalProps) {
  const [imageLoaded, setImageLoaded] = createSignal(false);
  const [imageStyle, setImageStyle] = createSignal({});

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      props.onClose();
    }
  };

  const handleBackdropClick = (e: MouseEvent) => {
    if (e.target === e.currentTarget) {
      props.onClose();
    }
  };

  const handleImageLoad = (e: Event) => {
    const img = e.target as HTMLImageElement;
    const naturalWidth = img.naturalWidth;
    const naturalHeight = img.naturalHeight;

    // Only run on client side
    if (isServer) return;

    // Target width: max-w-4xl (56rem = 896px at default font size)
    const targetWidth = Math.min(896, window.innerWidth * 0.9);
    const targetHeight = window.innerHeight * 0.8;

    // Calculate scale to fit target dimensions while maintaining aspect ratio
    const scaleX = targetWidth / naturalWidth;
    const scaleY = targetHeight / naturalHeight;
    const scale = Math.min(scaleX, scaleY); // Allow scaling up, but maintain aspect ratio

    // Apply the calculated dimensions
    const displayWidth = naturalWidth * scale;
    const displayHeight = naturalHeight * scale;

    setImageStyle({
      width: `${displayWidth}px`,
      height: `${displayHeight}px`,
      'max-width': '90vw',
      'max-height': '80vh'
    });

    setImageLoaded(true);
  };

  onMount(() => {
    if (!isServer) {
      document.addEventListener('keydown', handleKeyDown);
    }
  });

  onCleanup(() => {
    if (!isServer) {
      document.removeEventListener('keydown', handleKeyDown);
    }
  });

  return (
    <Show when={props.isOpen}>
      <div
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={handleBackdropClick}
      >
        <div class="relative w-full max-w-6xl max-h-full">
          {/* Close button */}
          <button
            onClick={props.onClose}
            class="absolute -top-12 right-0 text-white hover:text-gray-300 text-2xl font-bold z-10"
            aria-label="Закрыть изображение"
          >
            ✕
          </button>

          {/* Image container */}
          <div class="relative flex items-center justify-center w-full">
            <img
              src={props.src}
              alt={props.alt}
              class="rounded-lg shadow-2xl"
              onLoad={handleImageLoad}
              style={{
                display: imageLoaded() ? 'block' : 'none',
                ...imageStyle()
              }}
            />

            {/* Loading placeholder */}
            <Show when={!imageLoaded()}>
              <div class="w-96 h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600"></div>
              </div>
            </Show>
          </div>

          {/* Question text */}
          <div class="mt-6 max-w-4xl mx-auto">
            <div class="bg-white bg-opacity-95 rounded-lg p-4 shadow-lg">
              <p class="text-gray-800 text-sm leading-relaxed" innerHTML={props.question} />
            </div>
          </div>

          {/* Image info */}
          <div class="mt-4 text-center">
            <p class="text-white text-sm opacity-75">{props.alt}</p>
            <p class="text-white text-xs opacity-50 mt-1">
              Нажмите Escape или кликните вне изображения для закрытия
            </p>
          </div>
        </div>
      </div>
    </Show>
  );
}
