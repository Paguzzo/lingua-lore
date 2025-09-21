import { storage } from './storage';

async function cleanDuplicateCategories() {
  try {
    console.log('🔍 Verificando categorias duplicadas...');
    
    // Buscar todas as categorias
    const allCategories = await storage.getCategories();
    console.log(`📊 Total de categorias encontradas: ${allCategories.length}`);
    
    // Agrupar por slug para identificar duplicatas
    const categoryGroups = new Map<string, typeof allCategories>();
    
    allCategories.forEach(category => {
      const slug = category.slug;
      if (!categoryGroups.has(slug)) {
        categoryGroups.set(slug, []);
      }
      categoryGroups.get(slug)!.push(category);
    });
    
    console.log(`📋 Categorias únicas por slug: ${categoryGroups.size}`);
    
    // Identificar e remover duplicatas
    let duplicatesRemoved = 0;
    
    for (const [slug, categoryList] of categoryGroups) {
      if (categoryList.length > 1) {
        console.log(`🔄 Encontradas ${categoryList.length} duplicatas para '${slug}'`);
        
        // Manter a primeira categoria (mais antiga) e remover as outras
        const [keepCategory, ...duplicates] = categoryList.sort((a, b) => 
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        
        console.log(`✅ Mantendo categoria: ${keepCategory.name} (ID: ${keepCategory.id})`);
        
        // Remover duplicatas
        for (const duplicate of duplicates) {
          console.log(`🗑️ Removendo duplicata: ${duplicate.name} (ID: ${duplicate.id})`);
          await storage.deleteCategory(duplicate.id);
          duplicatesRemoved++;
        }
      }
    }
    
    console.log(`\n✨ Limpeza concluída!`);
    console.log(`📊 Duplicatas removidas: ${duplicatesRemoved}`);
    
    // Verificar resultado final
    const finalCategories = await storage.getCategories();
    console.log(`📋 Categorias restantes: ${finalCategories.length}`);
    
    finalCategories.forEach(cat => {
      console.log(`  - ${cat.name} (${cat.slug})`);
    });
    
  } catch (error) {
    console.error('❌ Erro ao limpar categorias duplicadas:', error);
  }
}

// Executar a limpeza
cleanDuplicateCategories().then(() => {
  console.log('🏁 Script finalizado');
  process.exit(0);
}).catch(error => {
  console.error('💥 Erro fatal:', error);
  process.exit(1);
});