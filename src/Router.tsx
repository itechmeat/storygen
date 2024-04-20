import { FC, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import { NotFoundPage } from './pages/NotFoundPage'
import { StoriesPage } from './pages/StoriesPage'
import { StoryPage } from './pages/StoryPage'
import { OpenAIPage } from './pages/OpenAIPage'

export const Router: FC = () => {
  return (
    <Suspense fallback={<div className="container">Loading...</div>}>
      <Routes>
        <Route index element={<HomePage />} />
        <Route path="openai" element={<OpenAIPage />} />

        <Route path="stories">
          <Route index element={<StoriesPage />} />
          <Route path=":storyId" element={<StoryPage />} />
        </Route>

        <Route path="/*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  )
}
