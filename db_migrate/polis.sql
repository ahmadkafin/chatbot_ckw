PGDMP                      }            chatbot_non_nlp    17.5    17.5     �           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                           false            �           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                           false            �           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                           false            �           1262    16707    chatbot_non_nlp    DATABASE     q   CREATE DATABASE chatbot_non_nlp WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'C';
    DROP DATABASE chatbot_non_nlp;
                     postgres    false            �          0    16772    polis 
   TABLE DATA           U   COPY public.polis (id, poli_id, name, is_active, created_at, updated_at) FROM stdin;
    public            
   kafinahmad    false    218          �           0    0    polis_id_seq    SEQUENCE SET     ;   SELECT pg_catalog.setval('public.polis_id_seq', 1, false);
          public            
   kafinahmad    false    217            �   2  x��Աn�0����{��6H���R��6ٺ\�K,������WܥR����I��g՜��z�t��$�ي�+./�	�r~��>�	rJ�k�0�T=\�!k)jɢ��d!C!]������dd�H� ��;v�+9*�E�v"y�������A��(3C���2%8Z��:>�ό��@�D!ԺS\���n�!���D�S�۩���!�T����A���*�;KG�\�}U8�� ���+B�5�v��g0֙��`�(�7e��ˎ�H��K�`&�[��T��>��}����!�     