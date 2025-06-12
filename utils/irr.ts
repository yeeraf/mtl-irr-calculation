/**
 * Calculates the Internal Rate of Return (IRR) for a series of cash flows.
 *
 * @param {number[]} cashFlows An array of cash flow values.
 * The first element (cashFlows[0]) is the cash flow at time 0.
 * Subsequent elements are cash flows at time 1, 2, and so on.
 * Must contain at least one positive and one negative value.
 * @returns {number | null} The IRR as a decimal (e.g., 0.05 for 5%),
 * or null if convergence fails or input is invalid.
 */
export function calculateIRR(cashFlows: number[]): number | null {
  // 1. Input Validation
  if (!Array.isArray(cashFlows) || cashFlows.length === 0) {
    alert("Invalid input: cashFlows must be a non-empty array.");
    return null;
  }

  let hasPositive = false;
  let hasNegative = false;
  for (const cf of cashFlows) {
    if (cf > 0) hasPositive = true;
    if (cf < 0) hasNegative = true;
  }

  if (!hasPositive || !hasNegative) {
    alert(
      "IRR requires at least one positive and one negative cash flow."
    );
    return null;
  }

  // 2. Iteration Parameters
  const maxIterations = 1000; // Max attempts to find a solution
  const tolerance = 0.000001; // How close NPV needs to be to zero for convergence
  let guessR = 0.1; // Initial guess for the IRR (10%)

  /**
   * Calculates the Net Present Value (NPV) for a given rate and cash flows.
   * @param {number} rate The discount rate.
   * @param {number[]} cfs The cash flows array.
   * @returns {number} The calculated NPV.
   */
  function calculateNPV(rate: number, cfs: number[]) {
    let npv = 0;
    for (let t = 0; t < cfs.length; t++) {
      npv += cfs[t] / Math.pow(1 + rate, t);
    }
    return npv;
  }

  /**
   * Calculates the derivative of the NPV function with respect to the rate.
   * Used in the Newton-Raphson method.
   * @param {number} rate The discount rate.
   * @param {number[]} cfs The cash flows array.
   * @returns {number} The derivative of NPV.
   */
  function calculateNPVPrime(rate: number, cfs: number[]) {
    let npvPrime = 0;
    for (let t = 1; t < cfs.length; t++) {
      // Start from t=1 as derivative of constant is 0
      npvPrime -= (cfs[t] * t) / Math.pow(1 + rate, t + 1);
    }
    return npvPrime;
  }

  // 3. Iterative Calculation (Newton-Raphson method)
  let currentR = guessR;

  for (let i = 0; i < maxIterations; i++) {
    const npvValue = calculateNPV(currentR, cashFlows);

    // Check for convergence
    if (Math.abs(npvValue) < tolerance) {
      return currentR; // IRR found!
    }

    const npvPrimeValue = calculateNPVPrime(currentR, cashFlows);

    // Avoid division by zero or near-zero derivative, which indicates issues
    if (Math.abs(npvPrimeValue) < tolerance) {
      // This can happen if the function is flat near the root,
      // or if no real root exists.
      alert(
        "IRR calculation: Derivative too close to zero. Potential convergence issue or no real root."
      );
      return null;
    }

    // Newton-Raphson formula: r_next = r - NPV(r) / NPV'(r)
    let nextR = currentR - npvValue / npvPrimeValue;

    // Basic safeguarding: ensure the rate doesn't go below -100% (-1.0)
    // as IRR cannot be less than -100%. If it does, adjust the step.
    if (nextR <= -1.0) {
      // If the next step is too aggressive, half the step towards -0.99
      nextR = (currentR + -0.99) / 2; // Keep it above -100%
      if (nextR >= currentR) {
        // If it's not actually moving towards -1, but stuck or going up, just return null.
        alert(
          "IRR calculation: Rate moving in an unexpected direction below -100%."
        );
        return null;
      }
    }

    currentR = nextR;
  }

  // 4. If maxIterations reached without convergence
  alert(
    "IRR calculation did not converge within the maximum iterations."
  );
  return null;
}
