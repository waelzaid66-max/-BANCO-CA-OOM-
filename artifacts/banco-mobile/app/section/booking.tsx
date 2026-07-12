import { SectionSearchApp } from "@/components/search/SectionSearchApp";

export default function BookingSectionScreen() {
  return (
    <SectionSearchApp
      category="real_estate"
      lockedEngine="rent"
      titleKey="home.categories.booking"
      subtitleKey="search.discover.section.bookingSub"
      headerIcon="calendar"
    />
  );
}
