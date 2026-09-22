import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export type FieldType = "text" | "textarea" | "number" | "boolean" | "list";

export type FieldDef = {
  key: string;
  label: string;
  type?: FieldType;
  required?: boolean;
  defaultValue?: unknown;
};

export type CrudConfig = {
  table: string;
  title: string;
  description: string;
  orderBy?: { column: string; ascending?: boolean };
  columns: { key: string; label: string }[];
  fields: FieldDef[];
  canWrite: boolean;
};

type Row = Record<string, any>;

const db = () => supabase as any;

export function CrudSection(config: CrudConfig) {
  const queryClient = useQueryClient();
  const queryKey = ["admin", config.table];
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Row>({});
  const [editingId, setEditingId] = useState<string | null>(null);

  const { data: rows = [], isLoading } = useQuery({
    queryKey,
    queryFn: async () => {
      let query = db().from(config.table).select("*");
      if (config.orderBy) {
        query = query.order(config.orderBy.column, {
          ascending: config.orderBy.ascending ?? true,
        });
      }
      const { data, error } = await query;
      if (error) throw error;
      return (data ?? []) as Row[];
    },
  });

  const save = useMutation({
    mutationFn: async (values: Row) => {
      const payload: Row = {};
      for (const field of config.fields) {
        let value = values[field.key];
        if (field.type === "number") value = Number(value ?? 0);
        if (field.type === "boolean") value = Boolean(value);
        if (field.type === "list") {
          value =
            typeof value === "string"
              ? value.split("\n").map((v) => v.trim()).filter(Boolean)
              : (value ?? []);
        }
        payload[field.key] = value ?? (field.type === "number" ? 0 : "");
      }
      if (editingId) {
        const { error } = await db().from(config.table).update(payload).eq("id", editingId);
        if (error) throw error;
      } else {
        const { error } = await db().from(config.table).insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success(editingId ? "Saved" : "Created");
      setOpen(false);
      setEditingId(null);
      void queryClient.invalidateQueries({ queryKey });
    },
    onError: (error: unknown) =>
      toast.error(error instanceof Error ? error.message : "Could not save"),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await db().from(config.table).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Deleted");
      void queryClient.invalidateQueries({ queryKey });
    },
    onError: (error: unknown) =>
      toast.error(error instanceof Error ? error.message : "Could not delete"),
  });

  function startCreate() {
    const initial: Row = {};
    for (const field of config.fields) initial[field.key] = field.defaultValue ?? "";
    setDraft(initial);
    setEditingId(null);
    setOpen(true);
  }

  function startEdit(row: Row) {
    const initial: Row = {};
    for (const field of config.fields) {
      const value = row[field.key];
      initial[field.key] = field.type === "list" && Array.isArray(value) ? value.join("\n") : value;
    }
    setDraft(initial);
    setEditingId(row.id as string);
    setOpen(true);
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <CardTitle>{config.title}</CardTitle>
          <CardDescription>{config.description}</CardDescription>
        </div>
        {config.canWrite ? (
          <Button size="sm" onClick={startCreate}>
            <Plus className="me-1 h-4 w-4" /> New
          </Button>
        ) : null}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : rows.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nothing here yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {config.columns.map((c) => (
                    <TableHead key={c.key}>{c.label}</TableHead>
                  ))}
                  <TableHead className="w-24" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.id}>
                    {config.columns.map((c) => (
                      <TableCell key={c.key} className="max-w-[240px] truncate">
                        {typeof row[c.key] === "boolean"
                          ? row[c.key]
                            ? "Yes"
                            : "No"
                          : String(row[c.key] ?? "")}
                      </TableCell>
                    ))}
                    <TableCell className="text-end">
                      {config.canWrite ? (
                        <div className="flex justify-end gap-1">
                          <Button size="icon" variant="ghost" onClick={() => startEdit(row)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => {
                              if (confirm("Delete this item?")) remove.mutate(row.id as string);
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      ) : null}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Edit" : "New"} — {config.title}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {config.fields.map((field) => (
              <div key={field.key} className="space-y-2">
                <Label htmlFor={field.key}>{field.label}</Label>
                {field.type === "textarea" || field.type === "list" ? (
                  <Textarea
                    id={field.key}
                    rows={field.type === "list" ? 4 : 6}
                    value={String(draft[field.key] ?? "")}
                    onChange={(e) => setDraft({ ...draft, [field.key]: e.target.value })}
                    placeholder={field.type === "list" ? "One item per line" : undefined}
                  />
                ) : field.type === "boolean" ? (
                  <div>
                    <Switch
                      id={field.key}
                      checked={Boolean(draft[field.key])}
                      onCheckedChange={(v) => setDraft({ ...draft, [field.key]: v })}
                    />
                  </div>
                ) : (
                  <Input
                    id={field.key}
                    type={field.type === "number" ? "number" : "text"}
                    value={String(draft[field.key] ?? "")}
                    onChange={(e) => setDraft({ ...draft, [field.key]: e.target.value })}
                  />
                )}
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => save.mutate(draft)} disabled={save.isPending}>
              {save.isPending ? "Saving…" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
