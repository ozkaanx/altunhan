export type HomepageContent = {
  id: number;

  hero_label: string;
  hero_title: string;
  hero_description: string;

  experience_title: string;
  experience_description: string;

  feature_1_title: string;
  feature_1_description: string;

  feature_2_title: string;
  feature_2_description: string;

  feature_3_title: string;
  feature_3_description: string;

  accommodation_label: string;
  accommodation_title: string;
  accommodation_description: string;

  location_label: string;
  location_title: string;

  reviews_label: string;
  reviews_title: string;

  footer_label: string;
  footer_title: string;
  footer_description: string;

  created_at: string;
  updated_at: string;
};

export type HomepageContentFormValues = {
  heroLabel: string;
  heroTitle: string;
  heroDescription: string;

  experienceTitle: string;
  experienceDescription: string;

  feature1Title: string;
  feature1Description: string;

  feature2Title: string;
  feature2Description: string;

  feature3Title: string;
  feature3Description: string;

  accommodationLabel: string;
  accommodationTitle: string;
  accommodationDescription: string;

  locationLabel: string;
  locationTitle: string;

  reviewsLabel: string;
  reviewsTitle: string;

  footerLabel: string;
  footerTitle: string;
  footerDescription: string;
};