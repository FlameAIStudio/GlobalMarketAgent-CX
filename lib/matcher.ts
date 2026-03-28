import { DATASETS } from "@/data/datasets";
import { DatasetCase } from "@/lib/types";

const normalize = (value: string): string => {
  return value.toLowerCase().trim().replace(/\s+/g, " ");
};

const toTokenSet = (value: string): Set<string> => {
  return new Set(value.split(/[^a-z0-9]+/i).filter(Boolean));
};

const scoreTriggerMatch = (keyword: string, trigger: string): number => {
  const normalizedKeyword = normalize(keyword);
  const normalizedTrigger = normalize(trigger);

  if (!normalizedKeyword || !normalizedTrigger) {
    return 0;
  }

  if (normalizedKeyword === normalizedTrigger) {
    return 100 + normalizedTrigger.length;
  }

  if (normalizedKeyword.includes(normalizedTrigger)) {
    return 75 + Math.min(normalizedTrigger.length, 20);
  }

  if (
    normalizedTrigger.includes(normalizedKeyword) &&
    normalizedKeyword.length >= 3
  ) {
    return 50 + Math.min(normalizedKeyword.length, 15);
  }

  const keywordTokens = toTokenSet(normalizedKeyword);
  const triggerTokens = toTokenSet(normalizedTrigger);

  if (triggerTokens.size === 0) {
    return 0;
  }

  let overlap = 0;
  triggerTokens.forEach((token) => {
    if (keywordTokens.has(token)) {
      overlap += 1;
    }
  });

  if (overlap === triggerTokens.size) {
    return 45 + overlap * 8;
  }

  if (overlap > 0) {
    return overlap * 12;
  }

  return 0;
};

const scoreDataset = (keyword: string, dataset: DatasetCase): number => {
  const triggerScore = dataset.keywordTriggers.reduce((best, trigger) => {
    return Math.max(best, scoreTriggerMatch(keyword, trigger));
  }, 0);

  // Mild recall boost if the product name itself appears.
  const productScore = scoreTriggerMatch(keyword, dataset.product);

  return Math.max(triggerScore, Math.round(productScore * 0.85));
};

export const matchDatasetByKeyword = (keyword: string): DatasetCase | null => {
  const normalized = normalize(keyword);

  if (!normalized) {
    return null;
  }

  let bestDataset: DatasetCase | null = null;
  let bestScore = 0;

  for (const dataset of DATASETS) {
    const score = scoreDataset(normalized, dataset);
    if (score > bestScore) {
      bestScore = score;
      bestDataset = dataset;
    }
  }

  return bestScore >= 24 ? bestDataset : null;
};
