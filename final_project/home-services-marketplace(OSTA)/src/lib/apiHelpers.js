import { NextResponse } from "next/server";

export function ok(data, status = 200) {
  return NextResponse.json(data, { status });
}

export function created(data) {
  return NextResponse.json(data, { status: 201 });
}

export function fail(message, status = 400) {
  return NextResponse.json({ message }, { status });
}

export function unauthorized(message = "Unauthorized") {
  return NextResponse.json({ message }, { status: 401 });
}

export function forbidden(message = "Forbidden") {
  return NextResponse.json({ message }, { status: 403 });
}

export function notFound(message = "Not found") {
  return NextResponse.json({ message }, { status: 404 });
}

export function serverError(error, fallback = "Internal server error") {
  if (error) console.error(error);
  const isProd = process.env.NODE_ENV === "production";
  const body = isProd
    ? { message: fallback }
    : { message: fallback, error: error?.message };
  return NextResponse.json(body, { status: 500 });
}

export function getPagination(searchParams, defaultLimit = 10, maxLimit = 50) {
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const requested = Number(searchParams.get("limit")) || defaultLimit;
  const limit = Math.min(Math.max(1, requested), maxLimit);
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}

export function buildPagedPayload(items, total, page, limit, key = "items") {
  return {
    [key]: items,
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit) || 1,
  };
}
