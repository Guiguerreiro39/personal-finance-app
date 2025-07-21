import { PrismaClient } from "./generated/";

const prisma = new PrismaClient();

async function main() {
	await prisma.category.upsert({
		where: { label: "Food" },
		update: {},
		create: {
			label: "Food",
		},
	});

	await prisma.category.upsert({
		where: { label: "Transportation" },
		update: {},
		create: {
			label: "Transportation",
		},
	});

	await prisma.category.upsert({
		where: { label: "Entertainment" },
		update: {},
		create: {
			label: "Entertainment",
		},
	});

	await prisma.category.upsert({
		where: { label: "Health" },
		update: {},
		create: {
			label: "Health",
		},
	});

	await prisma.category.upsert({
		where: { label: "Education" },
		update: {},
		create: {
			label: "Education",
		},
	});

	await prisma.category.upsert({
		where: { label: "Clothing" },
		update: {},
		create: {
			label: "Clothing",
		},
	});

	await prisma.category.upsert({
		where: { label: "Utilities" },
		update: {},
		create: {
			label: "Utilities",
		},
	});

	await prisma.category.upsert({
		where: { label: "House" },
		update: {},
		create: {
			label: "House",
		},
	});

	await prisma.category.upsert({
		where: { label: "Drinks" },
		update: {},
		create: {
			label: "Drinks",
		},
	});
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
