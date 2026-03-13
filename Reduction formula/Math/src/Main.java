import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        boolean keepRunning = true;
        System.out.println("=== Math2: Reduction Formula Calculator By (Java Recursion) ===");
        while (keepRunning) {
            displayMenu();
            System.out.print("\nChoose a formula (1-8) or 0 to exit: ");
            int choice = sc.nextInt();

            if (choice == 0) {
                keepRunning = false;
                System.out.println("Exiting...");
                break;
            }
            double result = 0;
            // هنطلب n و x لمعظم الحالات
            System.out.print("Enter (n) [The power]: ");
            int n = sc.nextInt();
            switch (choice) {// WE HAVE 7 CASES
                case 1:
                    result = wallisFormula(n);//call to wallisFormula method
                    System.out.println("Wallis Result (0 to PI/2): "+ result);
                    break;
                case 2:
                case 3:
                case 4:
                case 5:
                    System.out.print("Enter Lower limit (a) in degrees: ");
                    double a = Math.toRadians(sc.nextDouble());
                    System.out.print("Enter Upper limit (b) in degrees: ");
                    double b = Math.toRadians(sc.nextDouble());
                    if (choice == 2) result = tanReduction(n, b) - tanReduction(n, a);
                    else if (choice == 3) result = secReduction(n, b) - secReduction(n, a);
                    else if (choice == 4) result = xnSinX(n, b) - xnSinX(n, a);
                    else if (choice == 5) result = xnCosX(n, b) - xnCosX(n, a);

                    System.out.printf("Definite Integral Result: %.5f\n", result);
                    break;

                case 6: // x^m * cos(nx)
                    System.out.print("Enter the coefficient (n) inside cos(nx): ");
                    int innerN = sc.nextInt();
                    System.out.print("Enter Lower Bound (a) and Upper Bound (b) in degrees: ");
                    double a6 = Math.toRadians(sc.nextDouble());
                    double b6 = Math.toRadians(sc.nextDouble());
                    result = xmCosNX(n, innerN, b6) - xmCosNX(n, innerN, a6);
                    System.out.printf("Result:"+result);
                    break;

                case 7: // sin^n(x) * cos^m(x)
                    System.out.print("Enter the power for cos (m): ");
                    int mPower = sc.nextInt();
                    System.out.print("Enter Lower Bound (a) and Upper Bound (b) in degrees: ");
                    double a7 = Math.toRadians(sc.nextDouble());
                    double b7 = Math.toRadians(sc.nextDouble());
                    result = sinNCosM(n, mPower, b7) - sinNCosM(n, mPower, a7);
                    System.out.printf("Result:"+ result);
                    break;

                case 8: // القاعدة رقم 11: x^n * e^(mx)
                    System.out.print("Enter (m) [The coefficient of x in e^mx]: ");
                    double mVal = sc.nextDouble();

                    System.out.print("Enter Lower limit (a): ");
                    double a8 = sc.nextDouble();
                    System.out.print("Enter Upper limit (b): ");
                    double b8 = sc.nextDouble();

                    // حساب التكامل المحدود: F(b) - F(a)
                    // لاحظي: لا نستخدم Math.toRadians هنا لأن x قيم عادية وليست زوايا
                    result = xnExpMX(n, mVal, b8) - xnExpMX(n, mVal, a8);

                    System.out.printf("Definite Integral Result:"+ result);
                    break;
                    // ... الحالات من 1 لـ 7 تظل كما هي ...

                    case 9: // ln^m(x) / x^n
                        System.out.print("Enter (m) [Power of ln]: ");
                        int m9 = sc.nextInt();
                        System.out.print("Enter (n) [Power of x in denominator]: ");
                        int n9 = sc.nextInt();
                        System.out.print("Enter Lower limit (a) and Upper limit (b): ");
                        double a9 = sc.nextDouble(), b9 = sc.nextDouble();

                        // التعديل هنا: نمرر m9 و n9 للميثود
                        result = lnMOverXN(m9, n9, b9) - lnMOverXN(m9, n9, a9);
                        System.out.printf("Result: %.5f\n", result);
                        break;

                    case 10: // x^n * ln^m(x)
                        System.out.print("Enter (n) [Power of x]: ");
                        int n10 = sc.nextInt();
                        System.out.print("Enter (m) [Power of ln]: ");
                        int m10 = sc.nextInt();
                        System.out.print("Enter Lower limit (a) and Upper limit (b): ");
                        double a10 = sc.nextDouble(), b10 = sc.nextDouble();

                        // التعديل هنا: نمرر n10 و m10 للميثود
                        result = xNLnM(n10, m10, b10) - xNLnM(n10, m10, a10);
                        System.out.printf("Result: %.5f\n", result);
                        break;
                default:
                    System.out.println("Invalid choice, please try again.");
            }
            System.out.println("-------------------------------------------------");
        }
      }
    public static void displayMenu() {
        System.out.println("\nAvailable Formulas:");
        System.out.println("1. Wallis Formula (sin/cos from 0 to PI/2)");
        System.out.println("2. Integral of tan^n(x)");
        System.out.println("3. Integral of sec^n(x)");
        System.out.println("4. Integral of x^n * sin(x)");
        System.out.println("5. Integral of x^n * cos(x)");
        System.out.println("6. Integral of x^m * cos(nx)");
        System.out.println("7. Integral of sin^n(x) * cos^m(x)");
        System.out.println("8.x^n * e^(-x^2)");
        System.out.println("0. Exit");
    }


    // 1. Wallis Formula
    public static double wallisFormula(int n) {
        if (n == 0) return Math.PI / 2;
        if (n == 1) return 1.0;
        return ((double) (n - 1) / n) * wallisFormula(n - 2);
    }

    // 2. tan^n(x)
    public static double tanReduction(int n, double x) {
        if (n == 0) return x;//لو ال power =0  هيساوي ب 1 و تكامل بالنسبة ل xهو x
        if (n == 1) return (double) Math.log(Math.abs(1 / Math.cos(x)));
        return (Math.pow(Math.tan(x), n - 1) /(double) (n - 1)) - tanReduction(n - 2, x);
    }

    // 3. sec^n(x)
    public static double secReduction(int n, double x) {
        if (n == 0) return x;
        if (n == 1) return Math.log(Math.abs((1 / Math.cos(x)) + Math.tan(x)));
        double secX = 1.0 / Math.cos(x);
        double term1 = (Math.pow(secX, n - 2) * Math.tan(x)) / (n - 1);
        return term1 + ((double) (n - 2) / (n - 1)) * secReduction(n - 2, x);
    }

    public static double xnSinX(int n, double x) {
        if (n == 0) return -Math.cos(x);
        if (n == 1) return Math.sin(x) - x * Math.cos(x);//integration by parts
        return (-Math.pow(x, n) * Math.cos(x)) + n * Math.pow(x, n - 1) * Math.sin(x) - (n * (n - 1) * xnSinX(n - 2, x));
    }

    // 5. x^n * cos(x)
    public static double xnCosX(int n, double x) {
        if (n == 0) return Math.sin(x);
        if (n == 1) return Math.cos(x) + x * Math.sin(x);
        return Math.pow(x, n) * Math.sin(x) + n * Math.pow(x, n - 1) * Math.cos(x) - (n * (n - 1) * xnCosX(n - 2, x));
    }

    // 6. x^m * cos(nx)
    public static double xmCosNX(int m, int n, double x) {
        if (m == 0)
            return Math.sin(n * x) / n;
        double term1 = (Math.pow(x, m) * Math.sin(n * x)) / n;
        double term2 = (m * Math.pow(x, m - 1) * Math.cos(n * x)) / (n * n);
        return term1 + term2 - ((double) (m * (m - 1)) / (n * n)) * xmCosNX(m - 2, n, x);
    }

    // 7. sin^n(x) * cos^m(x)
    public static double sinNCosM(int n, int m, double x) {
        if (n == 0) return wallisFormula(m); // approximation using wallis-like logic
        if (n == 1) return -Math.pow(Math.cos(x), m + 1) / (m + 1);
        double term1 = (Math.pow(Math.sin(x), n - 1) * Math.pow(Math.cos(x), m + 1)) / (n + m);
        return term1 + ((double) (n - 1) / (n + m)) * sinNCosM(n - 2, m, x);
    }
    // القاعدة رقم 11: x^n * e^(mx)
    public static double xnExpMX(int n, double m, double x) {
        if (n == 0) return Math.exp(m * x) / m; // تكامل e^(mx) هو e^(mx)/m

        double term1 = (Math.pow(x, n) * Math.exp(m * x)) / m;
        double factor = (double) n / m;

        return term1 - (factor * xnExpMX(n - 1, m, x));
    }

    // القاعدة رقم 12: x^n * e^(-x^2)
    public static double xnExpNegX2(int n, double x) {
        // هذه الحالة تتوقف عند n=1 لسهولة التكامل
        if (n == 1) return Math.exp(-Math.pow(x, 2)) / -2.0;

        double term1 = (Math.pow(x, n - 1) * Math.exp(-Math.pow(x, 2))) / -2.0;
        double factor = (double) (n - 1) / 2.0;

        return term1 + (factor * xnExpNegX2(n - 2, x));
    }
    // (9) I_m,n = Integral of [ln^m(x) / x^n]
    public static double lnMOverXN(int m, int n, double x) {
        if (m == 0) return Math.pow(x, -n + 1) / (-n + 1); // تكامل 1/x^n

        double term1 = -Math.pow(Math.log(x), m) / ((n - 1) * Math.pow(x, n - 1));
        double factor = (double) m / (n - 1);
        return term1 + (factor * lnMOverXN(m - 1, n, x));
    }

    // (10) I_m,n = Integral of [x^n * ln^m(x)]
    public static double xNLnM(int n, int m, double x) {
        if (m == 0) return Math.pow(x, n + 1) / (n + 1); // تكامل x^n

        double term1 = (Math.pow(x, n + 1) * Math.pow(Math.log(x), m)) / (n + 1);
        double factor = (double) m / (n + 1);
        return term1 - (factor * xNLnM(n, m - 1, x));
    }
}