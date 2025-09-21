
import { db } from './db';
import { categories } from '../shared/schema';

const defaultCategories = [
  {
    name: 'IA Criativa',
    slug: 'ia-criativa',
    color: '#8B5CF6',
    description: 'Conteúdos sobre criatividade e inteligência artificial'
  },
  {
    name: 'Ferramentas',
    slug: 'ferramentas',
    color: '#3B82F6',
    description: 'Guia e reviews de ferramentas úteis'
  },
  {
    name: 'Automação',
    slug: 'automacao',
    color: '#10B981',
    description: 'Dicas e tutoriais de automação'
  },
  {
    name: 'Tutoriais',
    slug: 'tutoriais',
    color: '#F59E0B',
    description: 'Passo a passo e conteúdos educativos'
  }
];

export async function seedCategories() {
  try {
    // Check if categories already exist
    const existingCategories = await db.select().from(categories);
    
    if (existingCategories.length === 0) {
      await db.insert(categories).values(defaultCategories);
      console.log('✅ Categorias iniciais criadas com sucesso!');
    } else {
      console.log('ℹ️ Categorias já existem no banco de dados');
    }
  } catch (error) {
    console.error('❌ Erro ao criar categorias:', error);
  }
}
