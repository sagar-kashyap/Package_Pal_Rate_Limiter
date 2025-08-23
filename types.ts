
export interface PackageSuggestion {
  name: string;
  description: string;
  url?: string;
}

export interface LanguageOption {
  value: string;
  label: string;
}

export enum FormField {
  SourcePackage = "sourcePackage",
  SourceLanguage = "sourceLanguage",
  TargetLanguage = "targetLanguage",
  UserApiKey = "userApiKey",
}
