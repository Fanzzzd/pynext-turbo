import { AddHeroForm } from './components/AddHeroForm';
import { HeroList } from './components/HeroList';

const Feature = ({
  icon,
  title,
  children,
}: {
  icon: string;
  title: string;
  children: React.ReactNode;
}) => (
  <div className="text-center">
    <div className="mb-2 text-3xl">{icon}</div>
    <h3 className="mb-2 font-semibold">{title}</h3>
    <p className="text-sm text-gray-600 dark:text-gray-400">{children}</p>
  </div>
);

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <header className="mb-12 text-center">
          <h1 className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-4xl font-bold text-transparent">
            Pynext-Turbo Heroes
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            A demonstration of type-safe full-stack development with Next.js and
            FastAPI
          </p>
        </header>

        <div className="grid gap-8 md:grid-cols-2">
          <HeroList />
          <AddHeroForm />
        </div>

        <div className="mt-12 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 p-8 dark:from-gray-800 dark:to-gray-900">
          <h2 className="mb-6 text-center text-2xl font-semibold text-gray-800 dark:text-gray-200">
            🚀 Pynext-Turbo Features
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            <Feature icon="⚡" title="Type Safety">
              End-to-end type safety from FastAPI to React components
            </Feature>
            <Feature icon="🎯" title="Auto-Generated">
              API clients generated automatically from OpenAPI schemas
            </Feature>
            <Feature icon="📦" title="Monorepo">
              Shared packages and optimized builds with Turborepo
            </Feature>
          </div>
        </div>
      </div>
    </main>
  );
}
