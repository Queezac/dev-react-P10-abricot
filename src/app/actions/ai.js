'use server';

import { getProjectTasks } from './tasks';

const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY;

export async function generateAITasksAction(projectId, prompt) {
  if (!MISTRAL_API_KEY) {
    return { error: 'Clé API Mistral non configurée' };
  }

  try {
    const existingTasks = await getProjectTasks(projectId);
    const existingTitles = existingTasks.map(t => t.title).join(', ');

    const mistralPrompt = `Tu es un assistant de gestion de projet.
    
    CONTEXTE DU PROJET :
    Tâches déjà existantes : [${existingTitles || 'Aucune tâche pour le moment'}]

    DEMANDE UTILISATEUR :
    "${prompt}"

    CONSIGNES STRICTES :
    1. Analyse la demande : si l'utilisateur demande "une" tâche, n'en génère qu'UNE SEULE. S'il utilise le pluriel, décompose logiquement.
    2. NE crée PAS de tâches qui existent déjà dans la liste ci-dessus.
    3. Génère un tableau JSON d'objets avec : "title", "description", "status" ("TODO", "IN_PROGRESS", "DONE").
    4. Ne renvoie QUE le JSON brut.`;

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
        response_format: { type: 'json_object' }
      }),
    });

    if (!res.ok) {
      return { error: 'Erreur lors de la communication avec l\'API' };
    }

    const data = await res.json();
    let content = data.choices[0]?.message?.content || '[]';

    content = content.trim();
    if (content.startsWith('```')) {
      content = content.replace(/```json/g, '').replace(/```/g, '').trim();
    }

    let parsed;
    try {
      parsed = JSON.parse(content);
      const tasks = Array.isArray(parsed) ? parsed : (parsed.tasks || [parsed]);

      if (tasks.length === 0) return { error: 'Aucune tâche générée' };

      return { success: true, tasks };
    } catch (err) {
      console.error('Erreur parsing:', content);
      return { error: 'Format IA invalide' };
    }

  } catch (error) {
    console.error('Erreur:', error);
    return { error: 'Erreur inattendue' };
  }
}