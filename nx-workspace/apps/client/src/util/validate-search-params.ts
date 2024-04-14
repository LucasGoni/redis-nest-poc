import { ISearchParams } from "../interface/SearchParams";

export interface IValidationResult {
    errors: string[];
}

export function validateSearchParams(query: ISearchParams): IValidationResult | null {
    const { q, from, to, sortBy } = query;
    const errors: string[] = [];

// Validate 'q' parameter
if (!q || typeof q !== 'string' || q.length < 5 || !/^[a-zA-Z\s]+$/.test(q)) {
    errors.push('Invalid search parameter: Keyword/phrase must not be empty, have at least four characters, and contain only letters and spaces.');
}

// Validate 'from' parameter if provided
if (from && !isValidDate(from)) {
    errors.push('Invalid search parameter: From Date is not a valid value.');
}

// Validate 'to' parameter if provided
if (to && !isValidDate(to)) {
    errors.push('Invalid search parameter: To Date is not a valid value.');
}

// Validate 'sortBy' parameter if provided
// const validSortByValues = ['Relevancy', 'Popularity', 'Published At'];
// if (sortBy && !validSortByValues.includes(sortBy)) {
//     errors.push('Invalid search parameter: sortBy');
// }

// If there are errors, return them; otherwise, return null
if (errors.length > 0) {
    return { errors };
} else {
    return null;
}
}
// Helper function to validate date format
function isValidDate(dateString: string): boolean {
    // Check if dateString is a valid date in YYYY-MM-DD format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    return dateRegex.test(dateString);
}