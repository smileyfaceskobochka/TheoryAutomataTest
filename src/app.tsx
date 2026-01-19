import { MetaProvider, Title, Meta, Link } from "@solidjs/meta";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense, ErrorBoundary } from "solid-js";
import "./app.css";

function ErrorFallback(props: { error: any; reset: () => void }) {
  return (
    <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center px-4">
      <div class="bg-red-50 border border-red-200 rounded-lg p-8 max-w-md mx-auto text-center">
        <h2 class="text-red-800 font-bold text-xl mb-4">Что-то пошло не так</h2>
        <p class="text-red-600 mb-6">{props.error?.message || "Произошла непредвиденная ошибка."}</p>
        <button
          onClick={props.reset}
          class="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium"
        >
          Попробовать снова
        </button>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary fallback={ErrorFallback}>
      <Router
        root={props => (
          <MetaProvider>
            <Title>Theory of Automata - Exam Preparation</Title>
            <Link rel="icon" type="image/x-icon" href="/favicon.ico?v=1" />
            <Link rel="shortcut icon" href="/favicon.ico?v=1" />
            <Meta name="msapplication-TileColor" content="#2563eb" />
            <Meta name="theme-color" content="#2563eb" />
            <Suspense>{props.children}</Suspense>
          </MetaProvider>
        )}
      >
        <FileRoutes />
      </Router>
    </ErrorBoundary>
  );
}
