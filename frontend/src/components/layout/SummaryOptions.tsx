'use client';

import React, { useMemo, useState, useEffect } from 'react';
import CheckBox, { CheckBoxItemData } from '../ui/CheckBox/CheckBox';
import ComboBox from '../ui/ComboBox/ComboBox';
import { ComboBoxItemData } from '../ui/ComboBox/ComboBoxItem';
import ListBox from '../ui/ListBox/ListBox';
import { ListBoxItemData } from '../ui/ListBox/ListBoxItem';
import Slider from '../ui/Slider/Slider';

// Add: value structure and props
export interface SummaryOptionsData {
  summaryType: string | null;
  languageRegister: string | null;
  language: ComboBoxItemData | null;
  detailLevel: number;
  contentFocus: string[];
  structure: string[];
}

type SummaryOptionsProps = {
  value?: Partial<SummaryOptionsData>;
  onChange?: (value: SummaryOptionsData) => void;
  className?: string;
};

// Update signature to accept props
const SummaryOptions: React.FC<SummaryOptionsProps> = ({ value, onChange, className }) => {
  // Summary Type (single)
  const summaryTypeItems: CheckBoxItemData[] = useMemo(
    () => [
      { id: 'informativo', title: 'Informative', description: 'Presents facts clearly and concisely.' },
      { id: 'descriptivo', title: 'Descriptive', description: 'Focused on features and context.' },
      { id: 'investigacion', title: 'Research', description: 'Based on findings, evidence, and sources.' },
      { id: 'sinopsis', title: 'Synopsis', description: 'General overview without going into detail.' },
      { id: 'review', title: 'Review', description: 'Critical evaluation with a reasoned opinion.' }
    ],
    []
  );
  const [summaryTypeSelected, setSummaryTypeSelected] = useState<string[]>(
    value?.summaryType ? [value.summaryType] : []
  );

  // Language register (single)
  const languageRegisterItems: CheckBoxItemData[] = useMemo(
    () => [
      { id: 'formal', title: 'Formal', description: 'Professional and objective.' },
      { id: 'neutral', title: 'Neutral', description: 'Balanced and direct.' },
      { id: 'informal', title: 'Informal', description: 'Casual and conversational.' },
      { id: 'technical', title: 'Technical', description: 'With precise technical terms.' },
      { id: 'creative', title: 'Creative', description: 'Expressive with a narrative style.' },
      { id: 'persuasive', title: 'Persuasive', description: 'Aimed at convincing.' }
    ],
    []
  );
  const [registerSelected, setRegisterSelected] = useState<string[]>(
    value?.languageRegister ? [value.languageRegister] : []
  );

  // Language (combobox)
  const languageItems: ComboBoxItemData[] = useMemo(
    () => [
      { id: 'es', title: 'Spanish', description: 'ES', category: 'Language' },
      { id: 'en', title: 'English', description: 'EN', category: 'Language' },
      { id: 'pt', title: 'Portuguese', description: 'PT', category: 'Language' },
      { id: 'fr', title: 'French', description: 'FR', category: 'Language' },
      { id: 'de', title: 'German', description: 'DE', category: 'Language' },
      { id: 'it', title: 'Italian', description: 'IT', category: 'Language' },
      { id: 'ja', title: 'Japanese', description: 'JA', category: 'Language' }
    ],
    []
  );
  const [language, setLanguage] = useState<ComboBoxItemData | null>(value?.language ?? null);

  // Detail level (1..3)
  const [detailLevel, setDetailLevel] = useState<number>(value?.detailLevel ?? 2);
  const detailLabels = ['Short', 'Medium', 'Long'];

  // Content / Structure
  const contentFocusItemsBase: ListBoxItemData[] = useMemo(
    () => [
      { id: 'keywords', title: 'Keywords', description: 'Highlight relevant terms and concepts.' },
      { id: 'main-topics', title: 'Main topics', description: 'Core thematic axes of the text.' },
      { id: 'key-points', title: 'Key points', description: 'Most important ideas or conclusions.' }
    ],
    []
  );
  const [contentFocusSelected, setContentFocusSelected] = useState<string[]>(
    value?.contentFocus ?? []
  );

  // Structure attributes (selection implies Sí; unselected = No)
  const structureOptionIds = ['conclusions', 'citations', 'metrics', 'multi-sources', 'analysis'] as const;
  type StructureOptionId = (typeof structureOptionIds)[number];

  const [structureSelected, setStructureSelected] = useState<string[]>(
    value?.structure ?? []
  );
  const structureItems: ListBoxItemData[] = useMemo(() => {
    const yesNo = (id: string) => (structureSelected.includes(id) ? 'Yes' : 'No');
    return [
      { id: 'conclusions', title: 'Summary includes conclusions', description: yesNo('conclusions') },
      { id: 'citations', title: 'Summary includes citations or references', description: yesNo('citations') },
      { id: 'metrics', title: 'Contains data or metrics', description: yesNo('metrics') },
      { id: 'multi-sources', title: 'Summarizes multiple sources', description: yesNo('multi-sources') },
      { id: 'analysis', title: 'Includes analysis/interpretation', description: yesNo('analysis') }
    ];
  }, [structureSelected]);

  // Sync with parent value changes
  useEffect(() => {
    if (!value) return;
    setSummaryTypeSelected(value.summaryType ? [value.summaryType] : []);
    setRegisterSelected(value.languageRegister ? [value.languageRegister] : []);
    setLanguage(value.language ?? null);
    if (typeof value.detailLevel === 'number') setDetailLevel(value.detailLevel);
    if (Array.isArray(value.contentFocus)) setContentFocusSelected(value.contentFocus);
    if (Array.isArray(value.structure)) setStructureSelected(value.structure);
  }, [value?.summaryType, value?.languageRegister, value?.language, value?.detailLevel, value?.contentFocus, value?.structure]);

  // Emit changes upward whenever something changes
  useEffect(() => {
    onChange?.({
      summaryType: summaryTypeSelected[0] ?? null,
      languageRegister: registerSelected[0] ?? null,
      language,
      detailLevel,
      contentFocus: contentFocusSelected,
      structure: structureSelected
    });
  }, [
    summaryTypeSelected,
    registerSelected,
    language,
    detailLevel,
    contentFocusSelected,
    structureSelected,
    onChange
  ]);

  return (
    <div className={`p-6 md:p-8 max-w-10xl mx-auto space-y-6 ${className ?? ''}`}>
  <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Summary options</h1>

      {/* Top grid: Type, Register, Language */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Summary Type */}
        <section id="sp-opt-type" className="bg-white border border-gray-200 rounded-2xl p-5 md:p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Summary type</h2>
          <CheckBox
            items={summaryTypeItems}
            selectionMode="single"
            onSelectionChange={setSummaryTypeSelected}
            selectedIds={summaryTypeSelected}
            className="space-y-3"
          />
        </section>

        {/* Language Register */}
        <section id="sp-opt-register" className="bg-white border border-gray-200 rounded-2xl p-5 md:p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Language register</h2>
          <CheckBox
            items={languageRegisterItems}
            selectionMode="single"
            onSelectionChange={setRegisterSelected}
            selectedIds={registerSelected}
            className="space-y-3"
          />
        </section>

        {/* Language */}
        <section id="sp-opt-language" className="bg-white border border-gray-200 rounded-2xl p-5 md:p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Language</h2>
          <ComboBox
            items={languageItems}
            value={language}
            placeholder="Select language..."
            onSelect={setLanguage}
            showCategory={false}
            className=""
          />
          {/* Selected summary (compact pill row) */}
          <div className="mt-4 flex flex-wrap gap-2 text-xs text-gray-600">
            {summaryTypeSelected[0] && (
              <span className="px-2 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                Type: {summaryTypeItems.find(i => i.id === summaryTypeSelected[0])?.title}
              </span>
            )}
            {registerSelected[0] && (
              <span className="px-2 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                Register: {languageRegisterItems.find(i => i.id === registerSelected[0])?.title}
              </span>
            )}
            {language && (
              <span className="px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Language: {language.title}
              </span>
            )}
          </div>
        </section>
      </div>

      {/* Detail Level */}
      <section id="sp-opt-detail" className="bg-white border border-gray-200 rounded-2xl p-5 md:p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Detail level</h2>
        <div className="max-w-xl">
          <Slider
            min={1}
            max={3}
            step={1}
            value={detailLevel}
            onChange={setDetailLevel}
            label="Select level"
            showValue={false}
            showMinMaxLabels={false}
          />
          <div className="mt-3 grid grid-cols-3 text-sm">
            {detailLabels.map((label, idx) => {
              const lvl = idx + 1;
              const active = detailLevel === lvl;
              return (
                <div key={label} className="text-center">
                  <span
                    className={
                      'px-2 py-1 rounded-md ' +
                      (active
                        ? 'text-white bg-gradient-to-r from-blue-500 to-purple-600'
                        : 'text-gray-600')
                    }
                  >
                    {label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Content / Structure */}
      <section className="bg-white border border-gray-200 rounded-2xl p-5 md:p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Content / Structure</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Content focus */}
          <div id="sp-opt-content">
            <h3 className="text-base font-medium text-gray-700 mb-3">Focus on</h3>
            <ListBox
              items={contentFocusItemsBase}
              selectionMode="multiple"
              onSelectionChange={setContentFocusSelected}
              selectedIds={contentFocusSelected}
              className=""
            />
          </div>

          {/* Structure attributes */}
          <div id="sp-opt-attributes">
            <h3 className="text-base font-medium text-gray-700 mb-3">Summary attributes</h3>
            <ListBox
              items={structureItems}
              selectionMode="multiple"
              onSelectionChange={setStructureSelected}
              selectedIds={structureSelected}
              className=""
            />
            <div className="mt-3 text-xs text-gray-600">
              <span className="font-medium">Selected (Yes):</span>{' '}
              {structureSelected.length > 0
                ? structureItems
                    .filter(i => structureSelected.includes(i.id))
                    .map(i => i.title)
                    .join(', ')
                : 'None'}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SummaryOptions;
