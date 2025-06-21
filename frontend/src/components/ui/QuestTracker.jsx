import React from 'react'
import './styles/ui.css'

export default function QuestTracker({ activeQuest }) {
  if (!activeQuest) return null

  return (
    <div className="quest-tracker">
      <h4>📜 {activeQuest.title}</h4>
      <p>{activeQuest.description}</p>
      <p className="quest-progress">Progress: {activeQuest.progress}%</p>
    </div>
  )
}