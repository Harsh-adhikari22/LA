export type ExportToExcelOptions = {
  data: Record<string, any>[]
  fileName: string
  sheetName?: string
}

export async function exportToExcel({ data, fileName, sheetName = "Sheet1" }: ExportToExcelOptions) {
  if (typeof window === "undefined") return

  const XLSX = await import("xlsx")

  const worksheet = XLSX.utils.json_to_sheet(data)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName)

  const arrayBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" })
  const blob = new Blob([arrayBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  })

  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = fileName.endsWith(".xlsx") ? fileName : `${fileName}.xlsx`
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}
