import mongoose from 'mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CategorySchema } from '../src/category/schemas/category.schema';
import { ProductSchema } from '../src/product/schemas/product.schema';
import { OrderSchema } from '../src/order/schemas/order.schema';

async function seedDatabase() {
  ConfigModule.forRoot({
    envFilePath: '.env',
  });

  const configService = new ConfigService();

  try {
    const mongoUri = configService.get<string>('MONGO_URI');
    const mongoDbName = configService.get<string>('MONGO_DB_NAME');
    const mongoUser = configService.get<string>('MONGO_USER');
    const mongoPassword = configService.get<string>('MONGO_PASSWORD');
    const authSource = configService.get<string>('AUTH_SOURCE', 'admin');

    if (
      !mongoUri ||
      !mongoDbName ||
      !mongoUser ||
      !mongoPassword ||
      !authSource
    ) {
      throw new Error('COnfigure as variaveis de ambiente');
    }

    const fullMongoUri = `${mongoUri}/${mongoDbName}`;

    await mongoose.connect(fullMongoUri, {
      user: mongoUser,
      pass: mongoPassword,
      authSource: authSource,
    });

    const categoryModel = mongoose.model('Category', CategorySchema);
    const productModel = mongoose.model('Product', ProductSchema);
    const orderModel = mongoose.model('Order', OrderSchema);

    await categoryModel.deleteMany({});
    await productModel.deleteMany({});
    await orderModel.deleteMany({});

    const categories = await categoryModel.insertMany([
      { name: 'Eletronicos', description: 'Aparelhos eletronicos' },
      { name: 'Livros', description: 'Livros de ficção' },
      { name: 'Roupas', description: 'Vestuário e moda' },
      { name: 'Alimentos', description: 'Comidas e bebidas' },
      { name: 'Móveis', description: 'Móveis diversos' },
    ]);

    const products = await productModel.insertMany([
      {
        name: 'Smartphone',
        description: 'Smartphone',
        price: 699,
        imageUrl: 'https://example.com/smartphone.jpg',
        categories: [categories[0]._id],
      },
      {
        name: 'Notebook',
        description: 'Notebook de alta performance',
        price: 1200,
        imageUrl: 'https://example.com/laptop.jpg',
        categories: [categories[0]._id],
      },
      {
        name: 'Livro de Ficção',
        description: 'Um romance emocionante',
        price: 15,
        imageUrl: 'https://example.com/book.jpg',
        categories: [categories[1]._id],
      },
      {
        name: 'Camiseta',
        description: 'Camiseta basica',
        price: 25,
        imageUrl: 'https://example.com/camiseta.jpg',
        categories: [categories[2]._id],
      },
      {
        name: 'Pizza Congelada',
        description: 'Pizza pronta para assar',
        price: 20,
        imageUrl: 'https://example.com/pizza.jpg',
        categories: [categories[3]._id],
      },
      {
        name: 'Cadeira de Escritório',
        description: 'Cadeira ergonômica para conforto no trabalho',
        price: 250,
        imageUrl: 'https://example.com/office-chair.jpg',
        categories: [categories[4]._id],
      },
    ]);

    await Promise.all(
      categories.map(async (category) => {
        const relatedProducts = products.filter((product) =>
          product.categories.includes(category._id),
        );
        await categoryModel.updateOne(
          { _id: category._id },
          { $set: { products: relatedProducts.map((p) => p._id) } },
        );
      }),
    );

    await orderModel.insertMany([
      {
        date: new Date('2023-01-15T10:00:00Z'),
        products: [products[0]._id, products[1]._id],
        total: 1899,
      },
      {
        date: new Date('2023-02-10T14:30:00Z'),
        products: [products[2]._id],
        total: 15,
      },
      {
        date: new Date('2023-03-05T18:45:00Z'),
        products: [products[3]._id, products[4]._id],
        total: 45,
      },
      {
        date: new Date('2023-04-20T12:15:00Z'),
        products: [products[5]._id],
        total: 250,
      },
      {
        date: new Date('2023-05-30T09:00:00Z'),
        products: [products[1]._id, products[3]._id],
        total: 1225,
      },
    ]);

    await mongoose.disconnect();
    console.log('Base populada');
  } catch (error) {
    console.error(error);
  }
}

seedDatabase();
