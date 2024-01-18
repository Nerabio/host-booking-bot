export class NavigationMadel {
  previous: string;
  current: string;

  setCurrentRout(currentRout: string): void {
    this.previous = this.current;
    this.current = currentRout;
  }
}
