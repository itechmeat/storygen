import { FC, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import { NotFoundPage } from './pages/NotFoundPage'
import { OpenAIPage } from './pages/OpenAIPage'
import { StoriesPage } from './pages/StoriesPage'
import { StoryPage } from './pages/StoryPage'
import { TogetherAIPage } from './pages/TogetherAIPage'

export const Router: FC = () => {
  return (
    <Suspense fallback={<div className="container">Loading...</div>}>
      <Routes>
        <Route index element={<HomePage />} />
        <Route path="openai" element={<OpenAIPage />} />
        <Route path="together" element={<TogetherAIPage />} />

        <Route path="stories">
          <Route index element={<StoriesPage />} />
          <Route path=":storyId" element={<StoryPage />} />
        </Route>

        <Route path="/*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  )
}
