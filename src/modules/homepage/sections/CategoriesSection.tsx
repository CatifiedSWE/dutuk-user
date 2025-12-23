import { demoCategories } from '@/demo';
import { Card } from '@/modules/common/shared-ui';

export default function CategoriesSection() {
  return (
    <section className="py-16 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
          Browse by Category
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {demoCategories.map((category) => (
            <Card key={category.id} hover className="p-6 text-center cursor-pointer">
              <div className="text-4xl mb-3">{category.icon}</div>
              <h3 className="font-semibold text-gray-900 dark:text-white">{category.name}</h3>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
