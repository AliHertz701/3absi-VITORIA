import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertOrderSchema } from "@shared/schema";
import { useCart } from "@/hooks/use-cart";
import { useCreateOrder } from "@/hooks/use-orders";
import { useToast } from "@/hooks/use-toast";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { useLocation } from "wouter";
import { Loader2 } from "lucide-react";
import { z } from "zod";

// Frontend schema extends DB schema to handle types better
const checkoutSchema = insertOrderSchema.extend({
  customerEmail: z.string().email("Invalid email address"),
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const { mutate: createOrder, isPending } = useCreateOrder();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const form = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      items: [],
      total: 0,
      customerName: "",
      customerEmail: "",
      address: "",
    },
  });

  const onSubmit = (data: CheckoutForm) => {
    if (items.length === 0) return;

    const orderData = {
      ...data,
      items: items.map(item => ({
        productId: item.product.id,
        quantity: item.quantity,
        price: item.product.price
      })),
      total: total,
    };

    createOrder(orderData, {
      onSuccess: () => {
        toast({
          title: "Order Confirmed",
          description: "Thank you for your purchase. A confirmation email has been sent.",
        });
        clearCart();
        setLocation("/");
      },
    });
  };

  if (items.length === 0) {
    setLocation("/cart");
    return null;
  }

  return (
    <div className="min-h-screen bg-texture-paper flex flex-col">
      <Navigation />
      
      <div className="flex-1 pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Left: Form */}
          <div>
            <h1 className="font-display text-3xl mb-8">Secure Checkout</h1>
            
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-display text-lg border-b border-border pb-2">Contact Information</h3>
                
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest font-bold">Full Name</label>
                  <input
                    {...form.register("customerName")}
                    className="w-full bg-white/50 border border-border p-3 focus:outline-none focus:border-gold transition-colors"
                    placeholder="e.g. Eleanor Rigby"
                  />
                  {form.formState.errors.customerName && (
                    <p className="text-xs text-destructive">{form.formState.errors.customerName.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest font-bold">Email Address</label>
                  <input
                    {...form.register("customerEmail")}
                    type="email"
                    className="w-full bg-white/50 border border-border p-3 focus:outline-none focus:border-gold transition-colors"
                    placeholder="e.g. eleanor@example.com"
                  />
                  {form.formState.errors.customerEmail && (
                    <p className="text-xs text-destructive">{form.formState.errors.customerEmail.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-4 pt-4">
                <h3 className="font-display text-lg border-b border-border pb-2">Shipping Details</h3>
                
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest font-bold">Shipping Address</label>
                  <textarea
                    {...form.register("address")}
                    rows={4}
                    className="w-full bg-white/50 border border-border p-3 focus:outline-none focus:border-gold transition-colors"
                    placeholder="Full street address, city, and postal code"
                  />
                  {form.formState.errors.address && (
                    <p className="text-xs text-destructive">{form.formState.errors.address.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-4 pt-4">
                <h3 className="font-display text-lg border-b border-border pb-2">Payment</h3>
                <div className="bg-muted/30 p-4 border border-border text-sm text-muted-foreground">
                  <p>Secure payment processing provided by Stripe. (Demo Mode)</p>
                </div>
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="w-full bg-foreground text-background py-4 text-sm uppercase tracking-widest hover:bg-gold transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-8"
              >
                {isPending ? (
                  <span className="flex items-center justify-center">
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Processing...
                  </span>
                ) : (
                  `Place Order — $${(total / 100).toLocaleString()}`
                )}
              </button>
            </form>
          </div>

          {/* Right: Order Summary */}
          <div className="bg-white/40 p-8 h-fit border border-border">
            <h3 className="font-display text-xl mb-6">Order Summary</h3>
            
            <div className="space-y-6 mb-8">
              {items.map((item) => (
                <div key={item.product.id} className="flex justify-between items-start">
                  <div className="flex items-start space-x-4">
                    <div className="bg-muted w-12 h-16 flex-shrink-0">
                      <img 
                        src={JSON.parse(item.product.images as unknown as string)[0]} 
                        alt="" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-display text-sm">{item.product.name}</p>
                      <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="font-serif text-sm">${(item.product.price / 100).toLocaleString()}</p>
                </div>
              ))}
            </div>

            <div className="border-t border-border pt-6 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${(total / 100).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>Free (Standard)</span>
              </div>
              <div className="flex justify-between font-display text-lg pt-4 border-t border-border mt-4">
                <span>Total</span>
                <span>${(total / 100).toLocaleString()}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
      
      <Footer />
    </div>
  );
}
