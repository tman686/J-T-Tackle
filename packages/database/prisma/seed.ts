/**
 * Seed sample data for J & T Tackle (Phase 2 — requires a live DATABASE_URL).
 *
 * The same catalog is mirrored, without a database, in
 * apps/website/src/data/lures.ts so the site runs today.
 */
import { PrismaClient, BuoyancyClass, WaterType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const forge = await prisma.productFamily.upsert({
    where: { code: "FORGE" },
    update: {},
    create: {
      code: "FORGE",
      name: "Forge Series",
      positioning: "Power fishing, heavy cover, big fish.",
    },
  });

  const apex = await prisma.productFamily.upsert({
    where: { code: "APEX" },
    update: {},
    create: {
      code: "APEX",
      name: "Apex Series",
      positioning: "All-around confidence baits for pressured water.",
    },
  });

  const greenPumpkin = await prisma.color.upsert({
    where: { code: "GP-001" },
    update: {},
    create: {
      code: "GP-001",
      marketingName: "Marsh Standard",
      family: "Green Pumpkin",
      hex: "#5c5a34",
      clearWaterRating: 9,
      stainedWaterRating: 8,
      muddyWaterRating: 5,
      nightRating: 4,
    },
  });

  const durableSalt = await prisma.plastisolFormula.upsert({
    where: { code: "D-S-2" },
    update: {},
    create: {
      code: "D-S-2",
      name: "Durable + Salted, gen 2",
      hardness: 45,
      saltPercent: 6.5,
      density: 1.05,
      stretchRating: 7,
      floatingRating: 2,
      shelfLifeDays: 720,
      costPerBait: 0.18,
    },
  });

  const mold = await prisma.mold.upsert({
    where: { moldId: "JT-MOLD-00001" },
    update: {},
    create: {
      moldId: "JT-MOLD-00001",
      name: "Apex Craw 3.5in — 12 cavity",
      material: "6061 Aluminum",
      aluminumGrade: "6061-T6",
      cavities: 12,
      shotsProduced: 4200,
      expectedLife: 250000,
      currentLifePct: 1.68,
      avgCycleTimeSec: 95,
    },
  });

  await prisma.lure.upsert({
    where: { shapeDna: "JT-CRW-APEX-G2-V4" },
    update: {},
    create: {
      sku: "JT-APEX-CRW-35",
      shapeDna: "JT-CRW-APEX-G2-V4",
      name: "Apex Craw 3.5\"",
      category: "Craw",
      generation: 2,
      revision: 4,
      familyId: apex.id,
      moldId: mold.id,
      formulaId: durableSalt.id,
      lengthInches: 3.5,
      buoyancy: BuoyancyClass.SLOW_SINK,
      durability: 8,
      waterType: WaterType.FRESHWATER,
      targetSpecies: ["Largemouth Bass", "Smallmouth Bass"],
      waterClarity: ["Clear", "Stained"],
      seasons: ["Spring", "Summer", "Fall"],
      depthRange: "0-20 ft",
      riggingMethods: ["Texas Rig", "Flip/Pitch", "Carolina Rig"],
    },
  });

  // eslint-disable-next-line no-console
  console.log("Seeded families, color, formula, mold, and a lure.", {
    families: [forge.code, apex.code],
    color: greenPumpkin.code,
  });
}

main()
  .catch((e) => {
    // eslint-disable-next-line no-console
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
