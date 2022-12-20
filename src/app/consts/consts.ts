export const NamePattern = '^(?: *[а-яА-ЯA-Za-z]+ *-{0,1})+$';

export const NameWithNumbersPattern = "^(?: *[а-яА-ЯA-Za-z0-9]+ *)+$";

export const OrganizationNamePattern = "^[а-яА-ЯA-Za-z0-9, .-]*";

export const EmailPattern = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;

export const PhonePattern = /^\+?[^a-zA-Z]{5,}$/;

export const ExtendedNamePattern = '^[A-Za-zА-Яа-я0-9]+.*[А-Яа-яA-Za-z0-9]*s*$';

export const NumberPattern = '^[+-]?([0]|[1-9][0-9]*)$';

export const EnglishNumberPattern = /^[+-]{0,1}(?:\d+\.{0,1}\d*|\d*\.{0,1}\d+)$/;

export const BulgarianNumberPattern = /^[+-]{0,1}(?:\d+[\.,]{0,1}\d*|\d*[\.,]{0,1}\d+)$/;

export const IdentityNumberPattern = '^([0-9]*)$';

export const PasswordPattern = '^\\S.*\\S$';

export const Zero = 0;

export const EnglishFlag = 'gb';

export const EnglishCulture = 'en-US';

export const BulgarianFlag = 'bg';

export const MaxAllowedNumericValue = 2000000000;

export const MaxNumberInputLength = 14;