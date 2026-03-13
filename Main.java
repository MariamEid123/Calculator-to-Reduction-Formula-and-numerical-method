import java.util.Scanner;
import net.objecthunter.exp4j.Expression;//library to convert String to mathematical equation
import net.objecthunter.exp4j.ExpressionBuilder;
public class Main {
    // 1. Rectangular Rule
    public static double rectangularRule(double h, double[] fx) {
        double sum = 0;
        for (int i = 0; i < fx.length - 1; i++) {//will sum all intervals except the last one
            sum += fx[i];//will store the summation
        }
        return h * sum;//Rule->h(f(x0)+f(x1)+..+f(xn-1))
    }

    // 2. Trapezoidal Rule->h/2(y0+yn)+2(y1+...yn-1)
    public static double trapezoidalRule(double h, double[] fx) {
        int last = fx.length - 1;//last index in array
        double sum = fx[0] + fx[last];//(y0+yn)//the first and last
        for (int i = 1; i < last; i++) {
            sum += 2 * fx[i];//2* الباقي
        }
        return (h / 2) * sum;
    }

    // 3. Simpson's Rule
    public static double simpsonRule(double h, double[] fx) {
        int last = fx.length - 1;//last index
        double sum = fx[0] + fx[last];
        for (int i = 1; i < last; i++) {
            if (i % 2 != 0) {//ODD
                sum += 4 * fx[i];
            } else {//EVEN
                sum += 2 * fx[i];
            }
        }
        return (h / 3) * sum;
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        System.out.println("--- Numerical Integration Program (Dynamic) ---");

        while (true) {
            System.out.println("\nChoose 1 to exit, 2 to continue:");
            int startChoice = scanner.nextInt();
            scanner.nextLine();

            if (startChoice == 1) break;

            // طلب المعادلة من المستخدم
            System.out.print("Enter function (e.g., x^2 + sin(x)): ");
            String functionString = scanner.nextLine();//Store it as String

            System.out.print("Enter lower limit (a): ");
            double a = scanner.nextDouble();
            System.out.print("Enter upper limit (b): ");
            double b = scanner.nextDouble();
            System.out.print("Enter n (intervals): ");
            int n = scanner.nextInt();

            double h = (b - a) / n;//size of h
            double[] fxArray = new double[n + 1];//index start with 0 and i want from x0 to xn

            try {
                // بناء المعادلة باستخدام المكتبة
                Expression e = new ExpressionBuilder(functionString).variable("x").build();//.bild ->دي بتحول المعادلة إلى Expression جاهز للحساب.
//نا اخدت من المستخدم القيمة ال string فالقيمة دي اتخزنت فfunctionString و استخدمنا ال مكتبة عشان تشوفوا عملية حسابية و ان المتغير اسمو x ف االمعادلة f(x)
                // تعبئة الـ Array
                for (int i = 0; i <= n; i++) {
                    double xVal = a + (i * h);//بنحسب كل نقطة في الفترة بين ال a,b  بالقانون دة
                    e.setVariable("x", xVal);
                    fxArray[i] = e.evaluate();
                }

                System.out.println("\nChoose: 1-Trapezoidal, 2-Rectangular, 3-Simpson, 4-All");
                int choice = scanner.nextInt();

                // تنفيذ العمليات (نفس الجزء السابق)
                if (choice == 1 || choice == 4)
                    System.out.printf("Trapezoidal: %.6f\n", trapezoidalRule(h, fxArray));
                if (choice == 2 || choice == 4)
                    System.out.printf("Rectangular: %.6f\n", rectangularRule(h, fxArray));
                if (choice == 3 || choice == 4) {
                    if (n % 2 == 0)//شرط
                        System.out.printf("Simpson's: %.6f\n", simpsonRule(h, fxArray));
                    else
                        System.out.println("Simpson's error: n must be even.");
                }

            } catch (Exception ex) {//fix errors and mistakes
                System.out.println("Error in function expression: " + ex.getMessage());
            }
        }
        System.out.println("Done.");
        scanner.close();
    }
}