
import { db } from './db';
import { categories } from '../shared/schema';

const defaultCategories = [
  {
    name: 'Tecnologia',
    slug: 'tecnologia',
    color: '#3B82F6',
    description: 'Artigos sobre tecnologia e inovação'
  },
  {
    name: 'IA Tools',
    slug: 'ia-tools',
    color: '#8B5CF6',
    description: 'Ferramentas de inteligência artificial'
  },
  {
    name: 'Automações',
    slug: 'automacoes',
    color: '#10B981',
    description: 'Automação de processos e workflows'
  },
  {
    name: 'Monetização',
    slug: 'monetizacao',
    color: '#F59E0B',
    description: 'Estratégias de monetização'
  },
  {
    name: 'Marketing Digital',
    slug: 'marketing-digital',
    color: '#EF4444',
    description: 'Marketing e estratégias digitais'
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
