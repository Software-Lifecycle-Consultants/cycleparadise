/**
 * Button loading state manager
 * Adds spinner, disables button, prevents double-clicks
 */
export class ButtonLoadingManager {
  private originalContent: Map<HTMLButtonElement, string> = new Map();

  /**
   * Set button to loading state
   */
  setLoading(button: HTMLButtonElement, loadingText: string = 'Processing...'): void {
    // Store original content
    if (!this.originalContent.has(button)) {
      this.originalContent.set(button, button.innerHTML);
    }

    // Disable button
    button.disabled = true;
    button.classList.add('opacity-75', 'cursor-not-allowed');

    // Add spinner and loading text
    button.innerHTML = `
      <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      ${loadingText}
    `;
  }

  /**
   * Reset button to original state
   */
  reset(button: HTMLButtonElement): void {
    const originalContent = this.originalContent.get(button);
    if (originalContent) {
      button.innerHTML = originalContent;
      button.disabled = false;
      button.classList.remove('opacity-75', 'cursor-not-allowed');
    }
  }

  /**
   * Clear stored content for a button
   */
  clear(button: HTMLButtonElement): void {
    this.originalContent.delete(button);
  }
}

// Global instance
export const buttonLoader = new ButtonLoadingManager();

// Make available globally
if (typeof window !== 'undefined') {
  (window as any).buttonLoader = buttonLoader;
}
