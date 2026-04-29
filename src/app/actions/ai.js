'use server';

import { createTaskAction } from './tasks';

const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY;

export async function generateAITasksAction(projectId, prompt) {
  if (!MISTRAL_API_KEY) {
    return { error: 'Clé API Mistral non configurée' };
  }

  try {
    const mistralPrompt = `Tu es un assistant de gestion de projet. L'utilisateur veut créer des tâches avec la description suivante : "${prompt}".
Génère une liste de tâches au format JSON strict. Le JSON doit être un tableau d'objets, chaque objet ayant les propriétés suivantes :
- "title": Titre court et concis de la tâche (string).
- "description": Description détaillée de la tâche (string).
- "status": L'un des statuts suivants : "TODO", "IN_PROGRESS", "DONE" (string, par défaut "TODO").

Ne renvoie QUE le JSON, sans aucun texte autour (pas de backticks, pas de markdown).`;

    const res = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MISTRAL_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'mistral-small-latest',
        messages: [{ role: 'user', content: mistralPrompt }],
        temperature: 0.3,
      }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      console.error('Erreur API Mistral:', errorData);
      return { error: 'Erreur lors de la communication avec l\'API IA' };
    }

    const data = await res.json();
    let content = data.choices[0]?.message?.content || '[]';

    content = content.replace(/```json/g, '').replace(/```/g, '').trim();

    let tasks;
    try {
      tasks = JSON.parse(content);
    } catch (err) {
      console.error('Erreur parsing JSON Mistral:', content);
      return { error: 'Le format renvoyé par l\'IA est invalide' };
    }

    if (!Array.isArray(tasks) || tasks.length === 0) {
      return { error: 'Aucune tâche générée' };
    }

    return { success: true, tasks };
  } catch (error) {
    console.error('Erreur generateAITasksAction:', error);
    return { error: 'Erreur inattendue lors de la génération des tâches' };
  }
}
