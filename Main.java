import java.util.Scanner;
import net.objecthunter.exp4j.Expression;
import net.objecthunter.exp4j.ExpressionBuilder;

public class Main {
    // 1. Rectangular Rule
    public static double rectangularRule(double h, double[] fx) {
        double sum = 0;
        for (int i = 0; i < fx.length - 1; i++) {
            sum += fx[i];
        }
        return h * sum;
    }

    // 2. Trapezoidal Rule
    public static double trapezoidalRule(double h, double[] fx) {
        int last = fx.length - 1;
        double sum = fx[0] + fx[last];
        for (int i = 1; i < last; i++) {
            sum += 2 * fx[i];
        }
        return (h / 2) * sum;
    }

    // 3. Simpson's Rule
    public static double simpsonRule(double h, double[] fx) {
        int last = fx.length - 1;
        double sum = fx[0] + fx[last];
        for (int i = 1; i < last; i++) {
            if (i % 2 != 0) {
                sum += 4 * fx[i];
            } else {
                sum += 2 * fx[i];
            }
        }
        return (h / 3) * sum;
    }

    // دالة مساعدة عشان نملأ الـ Array بسهولة لأي n (عشان نحسب الـ Exact)
    public static double[] calculateFx(Expression e, double a, double n, double h) {
        double[] fx = new double[(int)n + 1];
        for (int i = 0; i <= n; i++) {
            double xVal = a + (i * h);
            e.setVariable("x", xVal);
            fx[i] = e.evaluate();
        }
        return fx;
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        System.out.println("--- Numerical Integration & Error Analysis ---");

        while (true) {
            System.out.println("\nChoose 1 to exit, 2 to continue:");
            int startChoice = scanner.nextInt();
            scanner.nextLine();

            if (startChoice == 1) break;

            System.out.print("Enter function (e.g., 1/(x+1)): ");
            String functionString = scanner.nextLine();

            System.out.print("Enter lower limit (a): ");
            double a = scanner.nextDouble();
            System.out.print("Enter upper limit (b): ");
            double b = scanner.nextDouble();
            System.out.print("Enter n (intervals): ");
            int n = scanner.nextInt();

            try {
                Expression e = new ExpressionBuilder(functionString).variable("x").build();

                // 1. حساب القيم للـ n اللي المستخدم دخلها
                double h = (b - a) / n;
                double[] fxArray = calculateFx(e, a, n, h);

                // 2. حساب الـ Exact Value (تقريبياً بـ n ضخمة جداً 100000)
                int nExact = 100000;
                double hExact = (b - a) / nExact;
                double[] fxExact = calculateFx(e, a, nExact, hExact);
                double exactValue = simpsonRule(hExact, fxExact); // دي المرجع بتاعنا

                System.out.println("\nChoose: 1-Trapezoidal, 2-Rectangular, 3-Simpson, 4-All");
                int choice = scanner.nextInt();

                System.out.println("\n" + "=".repeat(70));
                System.out.printf("%-15s | %-15s | %-15s\n", "Method", "Result", "Absolute Error");
                System.out.println("-".repeat(70));

                // Trapezoidal
                if (choice == 1 || choice == 4) {
                    double res = trapezoidalRule(h, fxArray);
                    double error = Math.abs(exactValue - res);
                    System.out.printf("%-15s | %-15.6f | %-15.6f\n", "Trapezoidal", res, error);
                }

                // Rectangular
                if (choice == 2 || choice == 4) {
                    double res = rectangularRule(h, fxArray);
                    double error = Math.abs(exactValue - res);
                    System.out.printf("%-15s | %-15.6f | %-15.6f\n", "Rectangular", res, error);
                }

                // Simpson
                if (choice == 3 || choice == 4) {
                    if (n % 2 == 0) {
                        double res = simpsonRule(h, fxArray);
                        double error = Math.abs(exactValue - res);
                        System.out.printf("%-15s | %-15.6f | %-15.6f\n", "Simpson's", res, error);
                    } else {
                        System.out.println("Simpson's Error: n must be even.");
                    }
                }

                System.out.println("-".repeat(70));
                System.out.printf("Estimated Exact Value: %.8f\n", exactValue);
                System.out.println("=".repeat(70));

            } catch (Exception ex) {
                System.out.println("Error: " + ex.getMessage());
            }
        }
        System.out.println("Program Finished.");
        scanner.close();
    }
}
