import { db } from "@/lib/db/drizzle";
import { howsTable } from "@/lib/db/schema";
import CardStackClient from "./MagicScrollSection";
import { CardData } from "./MagicScrollCard";

export default async function CardStack() {
  // Fetch dynamic steps straight from your database
  const dbHows = await db.select().from(howsTable).orderBy(howsTable.createdAt);

  // Fallback if no items are created yet in the CMS
  const cards: CardData[] = dbHows.length > 0 
    ? dbHows.map((item) => ({
        number: item.numberText,
        title: item.title,
        description: item.description,
        image: item.imageUrl || "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=1200&q=80",
      }))
    : [
        {
          number: "01",
          title: "UNLOCK YOUR\nPOWER PATH",
          description: "Choose Fitness, Nutrition, or the full combo to shape your comic journey.",
          image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=1200&q=80",
        },
      ];

  return <CardStackClient cards={cards} />;
}