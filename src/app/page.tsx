"use client"
import React, { useEffect, useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

export default function Home() {
  const [dateRetrouvailles, setDateRetrouvailles] = useState(null)
  const [reload, setReload] = useState(0)

  useEffect(() => {
    fetch("/api/dateRetrouvaille", {
      method: "GET",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(response => response.json())
      .then(data => {
        setDateRetrouvailles(data.dateRetrouvailles[0].debut)
      })
  }, [reload])


  const onSubmit = (data: { dateRetrouvaille: string }) => {
    form.reset()
    if (data?.dateRetrouvaille) {
      fetch("/api/dateRetrouvaille", {
        method: "POST",
        cache: "no-cache",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          newDate: data.dateRetrouvaille
        })
      })
        .then(response => response.json())
        .then(data => {
          setReload(reload + 1)
        })
    }
  };

  const calculDodo = (date: string) => {
    // Convertir la chaîne de caractères en objet Date
    const dateChoisie = new Date(date);

    // Obtenir la date d'aujourd'hui
    const dateActuelle = new Date();

    dateChoisie.setHours(0, 0, 0, 0);
    dateActuelle.setHours(0, 0, 0, 0);

    // Calculer la différence en millisecondes entre les deux dates
    const differenceMs = dateChoisie.getTime() - dateActuelle.getTime();

    // Convertir la différence de millisecondes en jours
    const differenceJours = differenceMs / (1000 * 60 * 60 * 24);

    // Arrondir le nombre de jours et le retourner
    return Math.round(differenceJours);
  }

  const formSchema = z.object({
    dateRetrouvaille: z.string().min(10, {
      message: "Dat retrouvaille jj/mm/aaaa",
    }),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dateRetrouvaille: "",
    },
  })


  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">

      {dateRetrouvailles ? <>dodo : {calculDodo(dateRetrouvailles)}</> : <>...</>}

      <br />

      {dateRetrouvailles ? <>dateRetrouvailles : {dateRetrouvailles}</> : <>...</>}


      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="dateRetrouvaille"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date retrouvaille * :</FormLabel>
                <FormControl>
                  <Input placeholder="Date retrouvaille" type='date' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>


    </main>
  )
}
